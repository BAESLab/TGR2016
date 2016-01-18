var noble = require('noble');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':test:');

var question_id = 1234,answer;

console.log('Program Start....');

noble.on('stateChange', function(state) {   // Event การเปลี่ยนแปลงสถานะของ Bluetooth เมื่อโปรแกรมสั่งเปิด
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    noble.startScanning([],true);   // เมื่อ Bluetooth On แล้วให้ทำการสั่ง Scan ||  [] any service UUID, allow duplicates, true ค้นหาแบบไม่กำหนดเวลา
    db.run("CREATE TABLE answer (num int,qid num,uuid text,ans int,time long)");
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  console.log('on -> scanStart');
});

noble.on('scanStop', function() {
  console.log('on -> scanStop');
	db.close();
});



noble.on('discover', function(peripheral) {  // return BLE Device ที่อยู่รอบๆ

	if( peripheral.address == 'cd:0f:e7:03:4d:10')
	{
		var time = new Date().getTime();
		console.log("TIME: "+time);
		console.log('on -> Name: ' + peripheral.advertisement.localName);
		console.log('on -> Address: ' + peripheral.address);
	
		var UUID = peripheral.advertisement.manufacturerData.slice(4,20);
		console.log('on -> UUID: ' + toHexString(UUID));

		var Mojor = peripheral.advertisement.manufacturerData.slice(20,22);
		console.log('on -> Major: ' + toHexString(Major));

		var Minor = peripheral.advertisement.manufacturerData.slice(22,24);
		console.log('on -> Major: ' + toHexString(Minor));
		var answer = {};
		answer.question_id = question_id;
		answer.UUID = UUID;
		answer.Major = Major;
		answer.Minor = Minor;
		answer.address = peripheral.address;
		answer.time = time;
		//  socket.emit('...',JSON.stringify(answer));  // # ส่งให้ Socket.io เพื่อส่งให้หน้าเว็บ
		db.prepare("INSERT INTO answer VALUES (0,"+question_id+",'"+peripheral.address+"','"+toHexString(Major)+"',"+time+")");
	} 
});


// Functions Convert Byte to HexString
function toHexString(arr) {
	var str ='';
	for(var i = 0; i < arr.length ; i++) {
		str += ((arr[i] < 16) ? "0":"") + arr[i].toString(16);
		//str += ":";
	}
	return str;
}


