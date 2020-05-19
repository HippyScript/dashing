    
        function filterList(filter, list) {
           crit = $(filter).val().toLocaleLowerCase();
           if (crit == "") {
               $(list + '>li').show();
           }
           $(list + '>li').each(function(){
                var txt = $(this).text().toLocaleLowerCase();

               if(txt.indexOf(crit) != -1) { 
                    $(this).show();
                }
                else {
                    $(this).hide();   
                }
            });
        }
            
        $("#SMBFilter").keyup(function(){filterList("#SMBFilter", "#SMBList");}); 
        $("#PortFilter").keyup(function(){filterList("#PortFilter", "#PortList");});
        $("#MountFilter").keyup(function(){filterList("#MountFilter", "#MountList");});