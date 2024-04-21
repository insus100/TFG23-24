import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";

export async function GET(request: Request) {
    await connectDB();

    const eventoId = await Event.aggregate([
        {
            $addFields: {
              maxLengthOfArray: {
                $size: "$favorites"
              }
            }
          },
          {
            $sort: {
              maxLengthOfArray: -1
            }
          },
          {
            $limit: 1
          },
          {
            $project: {
              _id: 1,
              maxLengthOfArray: 1
            }
          }
    ]);
    //console.log("eventoId", eventoId)
    const evento = await Event.findById(eventoId[0]._id).populate(['creator', 'attendingUsers', 'favorites', 'comments.user', 'recommendedBy', 'rejectedBy']);
    //console.log("evento", evento);

    return NextResponse.json(evento);
}