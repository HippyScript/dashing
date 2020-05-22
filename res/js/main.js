poll_interval = 8000 // Edit this (in milliseconds) to set interval between updates
           
$(document).ready(function(){
    get_app_menu();
    get_mounts();
    get_smb_connections();
    get_open_ports();
    get_public_ip();
    get_google_ping();
    get_docker_containers();
    setInterval(get_mounts, poll_interval);
    setInterval(get_smb_connections, poll_interval);
    setInterval(get_open_ports, poll_interval);
    setInterval(get_public_ip, poll_interval);
    setInterval(get_google_ping, poll_interval);   
    setInterval(get_docker_containers, poll_interval);

    $(".card-header").click (function() {
        contents_id = "#" + $(this).attr("id") + "Contents";
        $(contents_id).toggle();

    });

    $("#submitAdd").click ( function(event){
        event.preventDefault();
        add_app();
    });

    $("#submitRemove").click( function (event){
        remove_app();
    });
});