import 'package:json_annotation/json_annotation.dart';

part 'parkingzones.g.dart';

// Converts json object Bike to dart object Bike

@JsonSerializable(explicitToJson: true)
class ParkingZone {
  final List area;

  @JsonKey(name: 'city_name', defaultValue: 'Okänd')
  final String cityName;

  @JsonKey(name: 'parking_id', defaultValue: 'Okänt')
  final String parkingID;

  const ParkingZone(
      {required this.area, required this.cityName, required this.parkingID});

  factory ParkingZone.fromJson(Map<String, dynamic> json) =>
      _$ParkingZoneFromJson(json);

  Map<String, dynamic> toJson() => _$ParkingZoneToJson(this);

  @override
  String toString() =>
      'ParkingZone{area: $area, cityName: $cityName, parkingID: $parkingID}';
}
