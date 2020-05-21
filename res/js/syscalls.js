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
        return "<span class='badge badge-pill badge-warning'>X</span>";
    }
    else {
        return "<span class='badge badge-pill badge-info'>?</span>";
    }
}
function get_mounts() {
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_mounts' }, function(data) {mount_results = data;})
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
        
        $("#MountList").append(li_open + 
                                "  <h5 class='text-muted'>" + mount_results[key][0] + "</h5>\n" +
                                "  <div>Mounted at <br>\n<a href='file:////" + mount_results[key][5] + 
                                "' class='text-monospace text-primary'>" + mount_results[key][5] +
                                "</a></div>\n" + "<div>" + mount_results[key][3] + "B of " + mount_results[key][1] + 
                                "B free<br>" + 
                                "<div class='progress'>\n" + 
                                "<div class='progress-bar progress-bar-striped bg-secondary' role='progressbar' aria-valuenow='" + mount_results[key][4] + 
                                "' aria-valuemin='0' aria-valuemax='100'>" + mount_results[key][4] + "</div></div>\n" +
                                "  </li>\n");
    }
    
    filterList("#MountFilter", "#MountList");
}

function get_smb_connections(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_smb_connections' }, function(data) {smb_results = data;})
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

function get_open_ports(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_open_ports' }, function(data) {port_results = data;})
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

function get_public_ip(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_public_ip' }, function(data) {ip_results = data;})
      .done(function(msg){ 
        ip_results = msg;
        display_public_ip();
        });
}

function display_public_ip(){
    $("#PublicIP").html(ip_results);
}

function get_google_ping(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_google_ping' }, function(data) {ping_results = data;})
      .done(function(msg){ 
        ping_results = msg;
        display_google_ping();
        });
}

function display_google_ping(){
    $("#GooglePing").html(ping_results);
}

function get_docker_containers(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'get_docker_containers' }, function(data) {docker_results = data;})
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
        $(".main-menu").append("            <li data-toggle='tooltip' title='" + key + "' id='" + key + "'>\n<a href='" + app_menu[key]["url"] + "' class='appLink'>" + 
                                            "<img class='img-fluid' src='./res/apps/" + app_menu[key]["icon"] + 
                                            "' alt='ICON' height='40' width='40'><br></a>\n</li>");
    }

    $(".main-menu").append("            <li data-toggle='tooltip' title='Remove app' style='width: 40px; margin: auto;'>\n" +
                           "            <a href='#' onclick='populate_remove_dialog();' class='appLink' id='RemoveApp' data-toggle='modal' data-target='#removeAppDialog'><h3>-</h3></a>\n" +
                           "             </li>");
}

function populate_remove_dialog() {
    $("#appRemoveMenu").empty();
    for (key of Object.keys(app_menu)) {
        $("#appRemoveMenu").append(
            "<li>\n<a href='#' id='remove-" + key + "''>\n" +
            "<img src='./res/apps/" + app_menu[key]["icon"] + "' width='17px' />" + key + "</a>\n</li>");
    }
    $(document).on("click", "#appRemoveMenu li a", function(){$("#selectedApp").text($(this).text());});
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

function remove_app(){
    var result;
    $.get('./res/php/syscalls.php', { fname: 'remove_app', app_name: $("#selectedApp").text().trim() }, function(data) {app_menu = data;})
      .done(function(msg){ 
        $("#removeAppDialog").modal("hide");
        $(".main-menu").empty()
        $(".main-menu").append("            <li data-toggle='tooltip' title='Add app' style='width: 40px; margin: auto;'>\n" +
                            "   <a href='#' class='appLink' id='AddApp' data-toggle='modal' data-target='#addAppDialog'><h3>+</h3></a>\n" +
                            "</li>");
        get_app_menu();
    });
}    
