var noble = require('noble');

console.log('Program Start....');

noble.on('stateChange', function(state) {   // Event การเปลี่ยนแปลงสถานะของ Bluetooth เมื่อโปรแกรมสั่งเปิด
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    noble.startScanning([],true);   // เมื่อ Bluetooth On แล้วให้ทำการสั่ง Scan ||  [] any service UUID, allow duplicates, true ค้นหาแบบไม่กำหนดเวลา
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  console.log('on -> scanStart');
});

noble.on('scanStop', function() {
  console.log('on -> scanStop');
});



noble.on('discover', function(peripheral) {  // return BLE Device ที่อยู่รอบๆ

	if( peripheral.address == 'cd:0f:e7:03:4d:10')
	{
		console.log("TIME: "+new Date().getTime());
		console.log('on -> Name: ' + peripheral.advertisement.localName);
		console.log('on -> Address: ' + peripheral.address);
	
	/*	var UUID = peripheral.advertisement.manufacturerData.slice(4,20);
		console.log('on -> UUID: ' + toHexString(UUID));

		var Mojor = peripheral.advertisement.manufacturerData.slice(20,22);
		console.log('on -> Major: ' + toHexString(Mojor));

		var Minor = peripheral.advertisement.manufacturerData.slice(22,24);
		console.log('on -> Major: ' + toHexString(Minor));
	*/	console.log('================== Connecting..... =====================');


		peripheral.on('connect', function() {
		    console.log('on -> connect');
		    this.updateRssi();
		  });
		peripheral.on('rssiUpdate', function(rssi) {
		    console.log('on -> RSSI update ' + rssi);
		    this.discoverServices();
		  });

		peripheral.on('servicesDiscover', function(services) {
			for(var i=0;i<services.length;i++){
			    console.log('on -> peripheral services UUID:' + services[i].uuid +" name:"+services[i].name+" type:"+services[i].type);
			}
			    console.log('=====================================================');


			services[0].on('includedServicesDiscover', function(includedServiceUuids) {
				//console.log("size: "+includedServiceUuids.length);
			      this.discoverCharacteristics();
			    });			

			 services[0].on('characteristicsDiscover', function(characteristics) {
			      //console.log('on -> service characteristics discovered ' + characteristics);
				for(var i=0;i<characteristics.length;i++){
				      console.log('on -> service included services discovered ' + characteristics[i].uuid+" "
					+characteristics[i].name+" "+characteristics[i].type+"");
				}

			      var characteristicIndex = 0;

			      characteristics[characteristicIndex].on('read', function(data, isNotification) {
				console.log('on -> characteristic read ' + data + ' ' + isNotification);
				console.log(data);

				peripheral.disconnect();
			      });

			      characteristics[characteristicIndex].on('write', function() {
				console.log('on -> characteristic write ');

				//peripheral.disconnect();
			      });

			      characteristics[characteristicIndex].on('broadcast', function(state) {
				console.log('on -> characteristic broadcast ' + state);

				//peripheral.disconnect();
			      });

			      characteristics[characteristicIndex].on('notify', function(state) {
				console.log('on -> characteristic notify ' + state);

				//peripheral.disconnect();
			      });

			
			      characteristics[characteristicIndex].read(); 
			      //characteristics[characteristicIndex].write(new Buffer('hello'));
			      //characteristics[characteristicIndex].broadcast(true);
			      //characteristics[characteristicIndex].notify(true);
			      // characteristics[characteristicIndex].discoverDescriptors();
			    });
			services[0].discoverIncludedServices();
			
		  });
		
	    noble.stopScanning();
	    peripheral.connect();
	} 
});


// Functions Convert Byte to HexString
function toHexString(arr) {
	var str ='';
	for(var i = 0; i < arr.length ; i++) {
		str += ((arr[i] < 16) ? "0":"") + arr[i].toString(16);
		str += ":";
	}
	return str;
}


