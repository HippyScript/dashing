# Đashing
![Screenshot](https://github.com/HippyScript/dashing/blob/master/dashing.png)

A simple home server dashboard for keeping an eye on:
- Mounted volumes
- Samba connections
- Open TCP ports
- External IP address
- Running docker containers

## External Resources
- jQuery 3.5.1
- Bootstrap 4.4.1

## Requirements
- PHP 7
- Netstat
- Samba
- Sudo access for the http server to netstat, smbstatus, docker and df via the sudoers file
- Write access for the http server to the res/apps directory
