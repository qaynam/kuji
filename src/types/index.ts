export type RoomUserType = {
    status: ResultStatusType,
    name: string,
    id: string
}

export type RoomType = {
    id: string,
    gameName: string,
    count: number,
    winnerCount: number,
    users: RoomUsers
}

export type RoomUsers = Array<RoomUserType>;

export type ResultStatusType = "win" | "lose" | "pending";

export type RoomSocketType = {
    gameName: string,
    users?: RoomUsers,
    result?: Array<RoomUserType>
}

export type CreateRoomRequestBodyType = {
    gameName: string,
    count: number,
    winnerCount: number,
}