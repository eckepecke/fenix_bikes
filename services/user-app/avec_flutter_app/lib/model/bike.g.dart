// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bike.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Bike _$BikeFromJson(Map<String, dynamic> json) => Bike(
      location: json['location'] as List<dynamic>,
      status: Status.fromJson(json['status'] as Map<String, dynamic>),
      cityName: json['city_name'] as String? ?? 'Okänd',
      bikeID: json['bike_id'] as String? ?? 'Okänt',
      completedTrips: json['completed_trips'] as List<dynamic>,
    );

Map<String, dynamic> _$BikeToJson(Bike instance) => <String, dynamic>{
      'location': instance.location,
      'status': instance.status.toJson(),
      'completed_trips': instance.completedTrips,
      'city_name': instance.cityName,
      'bike_id': instance.bikeID,
    };
