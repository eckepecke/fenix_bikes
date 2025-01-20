import 'dart:async';

import 'package:avec_flutter_app/main.dart';
import 'package:avec_flutter_app/model/bike.dart';
import 'package:avec_flutter_app/model/user.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Receipt extends StatefulWidget {
  Receipt({super.key, required this.bikeID});

  String bikeID;
  @override
  State<Receipt> createState() => _ReceiptState();
}

class _ReceiptState extends State<Receipt> {
  final myController = TextEditingController();
  String _cost = '';

  @override
  void initState() {
    super.initState();
    _getCost();
  }

  Future<void> _getCost() async {
    var bikeID = widget.bikeID;
    final response1 = await http.get(
        Uri.parse('http://localhost:1337/api/v1/get/certain/bike/${bikeID}'));
    if (response1.statusCode == 200) {
      var bikeData = json.decode(response1.body);
      var fetchedBike = Bike.fromJson(bikeData);
      var tripID = fetchedBike.completedTrips.last;
      print(tripID);
      final response2 = await http.get(
          Uri.parse('http://localhost:1337/api/v1/trip/calculate/${tripID}'));
      if (response2.statusCode == 200) {
        // print(response2.body);
        setState(() {
          _cost = response2.body.toString();
        });

        print(_cost);
      } else {
        throw Exception('Failed to load JSON data');
      }
    } else {
      throw Exception('Failed to load JSON data');
    }
  }

  void _quit() {
    Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => const SignInPage()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Fenix'),
        ),
        body: Center(
          child: Column(
            children: [
              const SizedBox(height: 30),
              const Text('Tack för att du reste med Fenix Bikes',
                  style: TextStyle(fontSize: 18)),
              const SizedBox(height: 30),
              const Text('Kostnaden för resan blev:',
                  style: TextStyle(fontSize: 14)),
              Text((_cost == "") ? "Hämtar kostnad..." : "$_cost kr",
                  style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 30),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: ElevatedButton(
                  onPressed: _quit,
                  style: ButtonStyle(
                      padding: MaterialStateProperty.all(
                    const EdgeInsets.symmetric(
                        vertical: 20.0, horizontal: 60.0),
                  )),
                  child: const Text('Avsluta', style: TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ));
  }
}
