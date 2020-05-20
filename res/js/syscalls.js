var mount_results;
var smb_results;
var port_results;
var ip_results;
var ping_results;
var docker_results;

var li_open = "          <li class='list-group-item m-1 p-3 bg-light rounded border border-secondary shadow-sm'>\n";

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
                              "              <div class='text-muted text-monospace'>Port " + port_results[key][port_results[key].length - 1] + "</div>\n" +
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
    console.log(docker_results);
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
            $("#DockerList").append(li_open + "              <div class='text-muted text-monospace'>" + docker_results[key][1] + "</div>\n          </li>\n");
        }
    }
    
}