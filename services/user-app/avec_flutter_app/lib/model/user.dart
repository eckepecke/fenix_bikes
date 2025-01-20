import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

// Converts json object Bike to dart object Bike

@JsonSerializable(explicitToJson: true)
class User {
  final String name;
  final String email;
  final bool banned;
  @JsonKey(name: 'completed_trips')
  final List completedTrips;

  @JsonKey(name: 'user_id')
  final String userId;

  const User(
      {required this.name,
      required this.email,
      required this.userId,
      required this.banned,
      required this.completedTrips});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);

  @override
  String toString() =>
      'User{name: $name, email: $email, userId: $userId, banned: $banned, completeTrips: $completedTrips}';
}
