import express, {Response, Request} from "express";
import { Server } from 'socket.io'
import http from 'http';
import { v4 } from 'uuid';
import fs from "fs";
import { RoomType, CreateRoomRequestBodyType, RoomUserType, RoomSocketType, RoomUsers } from "./types";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let kujiQueryData: Array<RoomType> = [];


app.use(express.static(__dirname + "/../public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("hello");
});

app.post('/create-room', (req: Request, res: Response) => {
    const { count, gameName, winnerCount }:CreateRoomRequestBodyType = req.body;

    if(count || gameName || winnerCount) {
        const url = createRoom({ count, gameName, winnerCount });

        res.status(201).json(url)
    } else {
        res.status(400).json('validation error');
    }
})

app.get("/room/:roomId", (req: Request, res: Response) => {

    const room = findRoom(req.params.roomId);
    if(!room) return res.status(404).json("not found");

    res.status(200);
    res.write(fs.readFileSync(__dirname+"/../public/room/index.html", {encoding: "utf8"}));
    res.end();

})

app.post('/room/:roomId/add-user', (req: Request, res: Response) => {
    const room = findRoom(req.params.roomId);
    if(!room) return res.status(404).json("not found");
    
    const {userName} = req.body;

    if(!userName) return res.status(400);

    //満員超えた場合
    if((room as RoomType).users.length >= (room as RoomType).count) {
        return res.status(400).json('満員です');
    }

    const user: RoomUserType = {
        id: v4(),
        name: userName,
        status: "pending"
    };

    room.users.push(user);

    res.status(201).json(user);
})



io.on('connection', (socket) => {
    console.log("a user conneted");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    socket.on('join the room', (roomId: string) => {
        const room = findRoom(roomId) as RoomType;

        console.log(room);
        const roomSocketResult: RoomSocketType ={users: room.users, gameName: room.gameName}

        if(room.users.length === room.count) {
            const result = execWinner(room);
            delete roomSocketResult.users;

            roomSocketResult.result = result;
        }

        io.emit('room', roomSocketResult); 
    })
})

server.listen(3000, () => console.log("app is running port http://localhost:3000 🎇"));


function createRoom(roomField:CreateRoomRequestBodyType) {
    const room: RoomType = {
        id: v4(),
        ...roomField,
        users: []
    }

    kujiQueryData.push(room);

    return "/room/" + room.id
}

function findRoom(roomId:string ) {
    const room = kujiQueryData.find(room => room.id === roomId)
    if(room) return {...room, count: Number(room.count), winnerCount: Number(room.winnerCount)};

    return false;
}

function execWinner(room: RoomType): RoomUsers {

    let winnerList: Array<number> = [];

    for (let index:number = 0; index < room.winnerCount; index++) {
        let winnerIndex = generateUniqueIndexNumber(winnerList, room.count);
        winnerList.push(winnerIndex);
    }

    console.log(winnerList);
    console.log(room.winnerCount);

    room.users.forEach((user: RoomUserType,index: number) => {
        if(winnerList.includes(index + 1)){
            user.status = "win";
        } else {
            user.status = "lose";
        }
    })

    return room.users;
}

const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

function generateUniqueIndexNumber(winnerList:Array<number>, count: number, winnerIndexDefault?: number): number {

    let winnerIndex = winnerIndexDefault || randRange(1, count);

    if(winnerList.includes(winnerIndex)) {
        winnerIndex = randRange(1, count);
        
        return generateUniqueIndexNumber(winnerList, count, winnerIndex);
    } else {
        return winnerIndex
    }
}