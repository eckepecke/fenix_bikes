// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chargingstation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChargingStation _$ChargingStationFromJson(Map<String, dynamic> json) =>
    ChargingStation(
      location: json['location'] as List<dynamic>,
      cityName: json['city_name'] as String? ?? 'Okänd',
      chargingID: json['charging_id'] as String? ?? 'Okänt',
    );

Map<String, dynamic> _$ChargingStationToJson(ChargingStation instance) =>
    <String, dynamic>{
      'location': instance.location,
      'city_name': instance.cityName,
      'charging_id': instance.chargingID,
    };
