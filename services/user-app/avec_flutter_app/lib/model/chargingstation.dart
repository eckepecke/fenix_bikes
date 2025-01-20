import 'package:json_annotation/json_annotation.dart';

part 'chargingstation.g.dart';

// Converts json object Bike to dart object Bike

@JsonSerializable(explicitToJson: true)
class ChargingStation {
  final List location;

  @JsonKey(name: 'city_name', defaultValue: 'Okänd')
  final String cityName;

  @JsonKey(name: 'charging_id', defaultValue: 'Okänt')
  final String chargingID;

  const ChargingStation(
      {required this.location,
      required this.cityName,
      required this.chargingID});

  factory ChargingStation.fromJson(Map<String, dynamic> json) =>
      _$ChargingStationFromJson(json);

  Map<String, dynamic> toJson() => _$ChargingStationToJson(this);

  @override
  String toString() =>
      'ChargingStation{location: $location, cityName: $cityName, chargingID: $chargingID}';
}
