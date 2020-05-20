    <?php
        function get_mounts() : array {
            $result = array();
           $mount_lines = explode("\n", shell_exec('sudo df -h | grep /dev/sd'));
            foreach ($mount_lines as $line) {
                $line_parts = preg_split('/ +/', $line);
                array_push($result, $line_parts);
            }
            return $result;
        }
        function get_smb_connections() : array {
            $result = array();
            $smb_lines = explode("\n", shell_exec('sudo smbstatus --shares'));
            # Remove the header smbstatus returns
            unset($smb_lines[0]);
            unset($smb_lines[1]);
            unset($smb_lines[2]);
            foreach ($smb_lines as $line) {
                $line_parts = preg_split('/  +/', $line);
                array_push($result, $line_parts);
            }
            
            return $result;
        }
        function get_open_ports() : array {
            $result = array();
            $port_lines = explode("\n", shell_exec('sudo netstat -ltnp | grep -w LISTEN'));
            foreach ($port_lines as $line) {
                $line_parts = preg_split('/  +/', $line);
                $address_parts = explode(":", $line_parts[2]);
                array_push($line_parts, end($address_parts));
                array_push($result, $line_parts);
            }
            
            return $result;
            
        }
        function get_public_ip() : string {
            $result = shell_exec("curl https://ipinfo.io/ip");
            return $result;
        }

        function get_google_ping() : string {
            $result = shell_exec("ping -c 1 8.8.8.8");
            $result = substr($result, strpos($result, "time=") + 5, strlen($result) - strpos($result, "time="));
            $result = substr($result, 0, strpos($result, "ms") + 2);
            return $result;
        }
        function get_docker_containers() : array {
            if (shell_exec("which docker") != "") {
                $result = array();
                $docker_lines = explode("\n", shell_exec("sudo docker stats --no-stream"));
                foreach ($docker_lines as $line) {
                    $line_parts = preg_split('/  +/', $line);
                    array_push($result, $line_parts);
                }
                return $result;
            }
            else {
                return ["error" => "Docker not installed"];
            }
        }

header('Content-Type: application/json');

    $result_array = array();

    if( !isset($_GET['fname']) ) { $result_array['error'] = 'Function not specified'; }

        switch($_GET['fname']) {
            case 'get_mounts':
               $result_array = get_mounts();
               break;
            case 'get_smb_connections':
                $result_array = get_smb_connections();
                break;
            case 'get_open_ports':
                $result_array = get_open_ports();
                break;
            case 'get_public_ip':
                $result_array = get_public_ip();
                break;
            case 'get_google_ping':
                $result_array = get_google_ping();
                break;
            case 'get_docker_containers':
                $result_array = get_docker_containers();
                break;
            default:
               $result_array['error'] = 'Function '.$_GET['fname'].' not found';
               break;
        }


    echo json_encode($result_array);


?>