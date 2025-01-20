import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '/ride.dart';
import 'model/user.dart';

class HireBike extends StatefulWidget {
  HireBike({super.key, required this.userEmail});
  String userEmail;
  @override
  State<HireBike> createState() => _HireBikeState();
}

class _HireBikeState extends State<HireBike> {
  final myController = TextEditingController();
  String _textFieldValue = '';
  User? fetchedUser;

  @override
  void initState() {
    super.initState();
    _fetchUser();
  }

  Future<void> _fetchUser() async {
    final response = await http.get(Uri.parse(
        'http://localhost:1337/api/v1/get/user/email/${widget.userEmail}'));
    if (response.statusCode == 200) {
      var userData = json.decode(response.body);
      print(userData);
      fetchedUser = User.fromJson(userData);
    } else {
      throw Exception('Failed to load JSON data');
    }
  }

  void _startBike() async {
    var bikeID = _textFieldValue;
    print(bikeID);
    if (!fetchedUser!.banned) {
      try {
        final response = await http.post(
          Uri.parse('http://localhost:1337/api/v1/trip/start'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'bike_id': bikeID,
            'user_id': fetchedUser!.userId
          }),
        );
        if (response.statusCode == 200) {
          print('success! Started bike');
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      Ride(bikeID: bikeID, userID: fetchedUser!.userId)),
              (_) => false);
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Cykeln går inte att hyra, kontrollera cykelns ID.'),
        ));
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Du har inte möjlighet att hyra cykeln.'),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Hyr cykel'),
        ),
        body: Center(
          child: Column(
            children: [
              TextField(
                decoration:
                    const InputDecoration(hintText: 'Skriv in cykelns ID'),
                controller: myController,
                onChanged: (value) {
                  _textFieldValue = value;
                },
                textAlign: TextAlign.center,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: ElevatedButton(
                  onPressed: _startBike,
                  child: const Text('Hyr cykel'),
                ),
              ),
            ],
          ),
        ));
  }
}
