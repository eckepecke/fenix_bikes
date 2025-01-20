// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'parkingzones.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ParkingZone _$ParkingZoneFromJson(Map<String, dynamic> json) => ParkingZone(
      area: json['area'] as List<dynamic>,
      cityName: json['city_name'] as String? ?? 'Okänd',
      parkingID: json['parking_id'] as String? ?? 'Okänt',
    );

Map<String, dynamic> _$ParkingZoneToJson(ParkingZone instance) =>
    <String, dynamic>{
      'area': instance.area,
      'city_name': instance.cityName,
      'parking_id': instance.parkingID,
    };
