            function scrollToBottom() {
                let objDiv = document.getElementById("chat-log");
                objDiv.scrollTop = objDiv.scrollHeight;
            }

            scrollToBottom();

            var roomName = JSON.parse(document.getElementById('room-name').textContent);
            var userName = JSON.parse(document.getElementById('json-username').textContent);

            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + '/ws/app/'
                + roomName
                + '/'
            );

            chatSocket.onmessage = function(e) {
                console.log('onmessage');

                const data = JSON.parse(e.data);

                if (data.message) {
                    if(data.username===userName){
                        var msgListTag=document.createElement('li');
                        var pTag=document.createElement('p');
                        pTag.innerHTML += ('<b>' + 'You' + '</b>: <br><br> ' + data.message + '<br>');
                        msgListTag.className="sent";
                        msgListTag.appendChild(pTag);
                        document.querySelector('#chat-log').appendChild(msgListTag);
                    }else{
                        var msgListTag=document.createElement('li');
                        var pTag=document.createElement('p');
                        pTag.innerHTML += ('<b>' + data.username + '</b>: <br><br> ' + data.message + '<br>');
                        msgListTag.className="replies";
                        msgListTag.appendChild(pTag);
                        document.querySelector('#chat-log').appendChild(msgListTag);
                    };
                    
                    /*document.querySelector('#msgs').innerHTML += ('<b>' + data.username + '</b>: ' + data.message + '<br>');*/
                }

                scrollToBottom();
            };

            chatSocket.onclose = function(e) {
                console.log('The socket close unexpectadly');
            };
            
            document.querySelector('#chat-message-input').focus();
            document.querySelector('#chat-message-input').onkeyup = function(e) {
                if (e.keyCode === 13) {  // enter, return
                    document.querySelector('#chat-message-submit').click();
                }
            };

            document.querySelector('#chat-message-submit').onclick = function(e) {
                const messageInputDom = document.querySelector('#chat-message-input');
                const message = messageInputDom.value;

                chatSocket.send(JSON.stringify({
                    'message': message,
                    'username': userName,
                    'room': roomName
                }));

                messageInputDom.value = '';
            };

            function startvc(){
                var roomName = JSON.parse(document.getElementById('room-name').textContent);
                window.location.replace('/startvc/'+roomName+'/' );
                
            }
            
            function joinvc(){
                var roomName = JSON.parse(document.getElementById('room-name').textContent);
                window.location.replace('/joinvc/'+roomName+'/' );
                
            }