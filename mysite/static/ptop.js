                    function private(e){
                            var userName = JSON.parse(document.getElementById('json-username').textContent);
                            var query="#id"+e;
                            var roomName = document.querySelector(query).textContent ;
                            
                            console.log(roomName[0],roomName[roomName.length-1])
                    
                            
                            window.location.replace('/app/'+roomName + '/?username=' + userName);
                            
                            
                            
                        }