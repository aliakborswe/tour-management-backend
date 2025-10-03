//  user -> booking(pending) -> payment(unpaid) -> SSL Commerce -> booking update(confirmed) -> payment update(paid)

import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  CANCEL = "CANCEL",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment: Types.ObjectId;
  status: BOOKING_STATUS;
}
