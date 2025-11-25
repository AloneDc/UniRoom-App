import { z } from "zod";

export const reservationSchema = z.object({
  roomId: z.string().uuid(),
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
  userId: z.string().uuid(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
