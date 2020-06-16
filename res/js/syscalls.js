var mount_results;
var smb_results;
var port_results;
var ip_results;
var ping_results;
var docker_results;
var app_menu;

var li_open = "          <li class='list-group-item m-1 p-3 bg-light rounded border border-secondary shadow-sm'>\n";
var app_add_link =  "           <li data-toggle='tooltip' title='Add app' style='width: 40px; margin: auto;'>\n                <a href='#' class='appLink' id='AddApp' data-toggle='modal' data-target='#addAppDialog'><h3>+</h3></a>\n            </li>";



//Returns badge reflecting memory and CPU usage for a docker container
function get_badge(docker_item){
    if (parseFloat(docker_item[2]) < 50 && parseFloat(docker_item[4]) < 50) {
        return "<span class='badge badge-pill badge-success'>✓</span>";
    }
    else if (parseFloat(docker_item[2]) < 75 && parseFloat(docker_item[4]) < 75){
        return "<span class='badge badge-pill badge-warning'>!</span>";

    }
    else if (parseFloat(docker_item[2]) >= 75 || parseFloat(docker_item[4]) >= 75){
        return "<span class='badge badge-pill badge-danger'>X</span>";
    }
    else {
        return "<span class='badge badge-pill badge-info'>?</span>";
    }
}

// Gets mounted volumes, calls display_mounts() when server sends response
function get_mounts() {
    var result;
    $.get(endpoint, { fname: 'get_mounts' }, function(data) {mount_results = data;})
      .done(function(msg){ 
        mount_results = msg;
        display_mounts();
        });
}

function display_mounts() {

    for (key of Object.keys(mount_results)){
        if (mount_results[key][0] == "") {
            continue;
        }
        if($("#MountList").html().indexOf(mount_results[key][0]) != -1 && $("#MountList").html().indexOf(mount_results[key][5]) != -1){
            continue;
        }
        
        percent_as_int = mount_results[key][4].substr(0, mount_results[key][4].length - 1)
        $("#MountList").append(li_open + 
                                "  <h5 class='text-muted'>" + mount_results[key][0] + "</h5>\n" +
                                "  <div>Mounted at <br>\n<a href='file:////" + mount_results[key][5] + 
                                "' class='text-monospace text-primary'>" + mount_results[key][5] +
                                "</a></div>\n" + "<div>" + mount_results[key][3] + "B of " + mount_results[key][1] + 
                                "B free<br>" + 
                                "<div class='progress'>\n" + 
                                "<div class='progress-bar progress-bar-striped bg-secondary' role='progressbar' aria-valuenow='" + percent_as_int + 
                                "' aria-valuemin='0' aria-valuemax='100' style='width: " + mount_results[key][4] + ";'>" + mount_results[key][4] + "</div></div>\n" +
                                "  </li>\n");
    }
    
    filterList("#MountFilter", "#MountList");
}

// Gets smb connections, calls display_smb() when server sends response
function get_smb_connections(){
    var result;
    $.get(endpoint, { fname: 'get_smb_connections' }, function(data) {smb_results = data;})
      .done(function(msg){ 
        smb_results = msg;
        display_smb();
        });
}

function display_smb() {
    $("#SMBList").empty();
    for (key of Object.keys(smb_results)){
        if (smb_results[key][0] == "") {
            continue;
        }

        $("#SMBList").append(li_open +
                             "          <h5 class='text-muted'>" + smb_results[key][0] + "</h5>\n" +
                             "          <div class='text-muted text-monospace'>" + smb_results[key][2] + "</div>" +
                             "          <div>Connected " + smb_results[key][3] + "</div>" + 
                             "          </li>\n");
    }
    filterList("#SMBFilter", "#SMBList");
}
// Gets open TCP ports, calls display_ports() when server sends response
function get_open_ports(){
    var result;
    $.get(endpoint, { fname: 'get_open_ports' }, function(data) {port_results = data;})
      .done(function(msg){ 
        port_results = msg;
        display_open_ports();
        });
}

function display_open_ports() {
    $("#PortList").empty();
    for (key of Object.keys(port_results)){
        if (port_results[key][0] == "") {
            continue;
        }

        $("#PortList").append(li_open +
                              "              <h5 class='text-muted'>" + port_results[key][5] + "</h5>\n" +
                              "              <div>Port " + port_results[key][port_results[key].length - 1] + "</div>\n" +
                              "          </li>\n");
    }
    filterList("#PortFilter", "#PortList");
}

// Gets public-facing IP, calls display_ip() when server sends response
function get_public_ip(){
    var result;
    $.get(endpoint, { fname: 'get_public_ip' }, function(data) {ip_results = data;})
      .done(function(msg){ 
        ip_results = msg;
        display_public_ip();
        });
}

function display_public_ip(){
    $("#PublicIP").html(ip_results);
}

// Gets time of ping to 8.8.8.8, calls display_ping() when server sends response
function get_google_ping(){
    var result;
    $.get(endpoint, { fname: 'get_google_ping' }, function(data) {ping_results = data;})
      .done(function(msg){ 
        ping_results = msg;
        display_google_ping();
        });
}


function display_google_ping(){
    $("#GooglePing").html(ping_results);
}

// Gets list of docker containers, calls display_docker_containers() when server sends response
function get_docker_containers(){
    var result;
    $.get(endpoint, { fname: 'get_docker_containers' }, function(data) {docker_results = data;})
      .done(function(msg){ 
        docker_results = msg;
        display_docker_containers();
        });    
}

function display_docker_containers(){
    $("#DockerList").empty();
    $("#DockerCard").show();
    for (key of Object.keys(docker_results)){
        // Hide the entire card if the docker stats return an error
        if(key == "error") {
            $("#DockerCard").hide();
            return;
        }
        
        // Skip blank lines and the first header line of the results
        if (docker_results[key] == "" || docker_results[key][0].indexOf("CONTAINER ID") != -1) {
            continue;
        }
        else {

            // tooltip provides resource usage for each container;
            // badge type depends on memory and cpu usage
            $("#DockerList").append(li_open + "              <div data-toggle='tooltip' title='CPU %: " + docker_results[key][2] +
                                                "\nMemory Used: " + docker_results[key][4] + "\nContainer ID: " + docker_results[key][0] + "' " +
                                                "class='text-muted'>" + docker_results[key][1] + " \n<br>" + get_badge(docker_results[key]) + "</div>\n        </li>\n");
        }
    }
}

function get_app_menu(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_app_menu' }, function(data) {app_menu = data;})
      .done(function(msg){ 
        app_menu = msg;
        populate_menu();
        });
}

function populate_menu() {
    for (key of Object.keys(app_menu)) {
        $(".main-menu").append("            <li data-toggle='tooltip' class='m-2' style='display: block; height: 40px; width: 40px; background-position: center center; background-size: 40px 40px; background-image: url(res/apps/" + app_menu[key]["icon"] + ");' title='" + key + "' id='" + key + "'>\n<a href='" + app_menu[key]["url"] + "' class='appLink'>" + 
                                            "<br></a>\n<img class='deleteButton' id='delete-" + key + "' " +
                                            "src='res/feather/trash-2.svg' class='deleteButton' data-toggle='tooltip' data-placement='top'" +
                                            " title='Remove " + key + "'' alt='-'>\n" + "</li>");
    }
    $(document).on("mouseenter", ".main-menu li", function(){
        $(".main-menu li").stop();
        $(".main-menu li .deleteButton").hide();
        $("#delete-" + $(this).attr("id")).toggle(500);
    });
    $(document).on("mouseleave", ".main-menu li", function(){
        $(".main-menu li").stop();
        $(".main-menu li .deleteButton").hide();
        //$("#delete-" + $(this).attr("id")).toggle();
    });
    $(document).on("click", ".main-menu li .deleteButton", function(){
        if(confirm("Remove " + $(this).attr("id").replace("delete-", "") + "?")) {
            remove_app($(this).attr("id").replace("delete-", ""));
        }
    });
}

function add_app() {
    var frm_data = document.getElementById("fileUploadForm"); 
    var whole_form = new FormData(frm_data);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "res/php/upload.php",
        data: new FormData(frm_data),
        processData: false, 
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
                $("#result").text(data);
                $("#addAppDialog").modal("hide");
                $(".main-menu").empty();
                $(".main-menu").append(app_add_link);
                get_app_menu();
            },
        error: function (e) {
                $("#result").text(e.responseText);
                alert(e.responseText);
                $("#btnSubmit").prop("disabled", false);
            }
        });
    }

function remove_app(appName){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'remove_app', app_name: appName }, function(data) {app_menu = data;})
      .done(function(msg){ 
        $(".main-menu").empty()
        $(".main-menu").append("            <li data-toggle='tooltip' title='Add app' style='width: 40px; margin: auto;'>\n" +
                            "   <a href='#' class='appLink' id='AddApp' data-toggle='modal' data-target='#addAppDialog'><h3>+</h3></a>\n" +
                            "</li>");
        get_app_menu();
    });
}    
