import {Connection} from 'mongoose.Mongoose';

declare global{
    var mongoose:{
        connection:Connection | null;
        promise:Promise<Connection> | null;
    };
}

export {};