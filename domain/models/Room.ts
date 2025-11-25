export interface Room {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  room_photos: { photo_url: string }[]; // ✅ columna real
}
