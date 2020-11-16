
class Boards {
    constructor(dbConn) {
        this.dbConn = dbConn;
    }

    async getBoardMetadata(boardId) {
        let boardRecord = await this.dbConn.query("SELECT room FROM public.boards WHERE board_id=$1", [boardId]);
        return boardRecord.rows[0];
    }
}

module.exports = Boards;
