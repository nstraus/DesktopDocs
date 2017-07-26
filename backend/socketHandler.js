function socketHandler(io){
    io.on('connection', socket => {
        console.log('listening in socket...');

        socket.on('login', loginInfo => {

            socket.username = JSON.parse(loginInfo).username;
            socket.userId = JSON.parse(loginInfo).userId;
            //console.log('username in socket', socket.username );
            //console.log('userId in socket', socket.userId );
        });

        socket.on('joinedDocument', docId => {
            socket.docId = String(docId);
            //console.log('user accessing doc', socket.username );
            //console.log('docId in socket', socket.docId );
        });

        socket.on('leftDocument', docId => {
            socket.docId = null;
            //console.log('user left doc', socket.username );
            //console.log('docId that was left', docId );
        });

        socket.on('madeChange', changedDoc => {
            socket.changedDoc = changedDoc;
            //console.log('user edit doc', socket.username );
            //console.log('edited docId', socket.docId );
            //console.log('changed doc', socket.changedDoc );
        });
    });
}

module.exports = {
    socketHandler
};
