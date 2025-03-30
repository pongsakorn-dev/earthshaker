// ข้อมูลห้องที่มีอยู่ในระบบ
export interface RoomInfo {
  roomNumber: string;
  floor: number;
  building?: string;
}

// สร้างรายการห้องตัวอย่าง 101-110, 201-210, 301-310
export const generateRoomNumbers = (): RoomInfo[] => {
  const rooms: RoomInfo[] = [];
  
  // สร้างห้องชั้น 1-3
  for (let floor = 1; floor <= 3; floor++) {
    for (let room = 1; room <= 10; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      rooms.push({
        roomNumber,
        floor,
        building: 'A',
      });
    }
  }
  
  return rooms;
};

// ส่งออกรายการห้องทั้งหมด
export const roomList: RoomInfo[] = generateRoomNumbers();

// สำหรับค้นหาห้องตามหมายเลข
export const findRoomByNumber = (roomNumber: string): RoomInfo | undefined => {
  return roomList.find(room => room.roomNumber === roomNumber);
};

// สำหรับกรองห้องตาม input ที่ผู้ใช้พิมพ์
export const filterRoomsByInput = (input: string): RoomInfo[] => {
  if (!input) return roomList;
  const lowerInput = input.toLowerCase();
  return roomList.filter(room => 
    room.roomNumber.toLowerCase().includes(lowerInput)
  );
}; 