// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
      name: json['name'] as String,
      email: json['email'] as String,
      userId: json['user_id'] as String,
      banned: json['banned'] as bool,
      completedTrips: json['completed_trips'] as List<dynamic>,
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'banned': instance.banned,
      'completed_trips': instance.completedTrips,
      'user_id': instance.userId,
    };
