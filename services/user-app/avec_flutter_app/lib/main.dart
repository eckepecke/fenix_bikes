import 'package:avec_flutter_app/home.dart';
import 'package:avec_flutter_app/model/google_signin_api.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'map.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Main

Future main() async {
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return MaterialApp(
      title: 'Fenix app',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 211, 141, 76)),
        primaryColor: const Color.fromARGB(255, 211, 141, 76),
        textTheme: GoogleFonts.fugazOneTextTheme(textTheme).copyWith(
          bodyMedium: GoogleFonts.oswald(textStyle: textTheme.bodyMedium),
          bodyLarge: GoogleFonts.fugazOne(textStyle: textTheme.bodyMedium),
          displayMedium:
              GoogleFonts.fugazOne(textStyle: textTheme.displayMedium),
        ),
        useMaterial3: true,
      ),
      home: SignInPage(),
    );
  }
}

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInState();
}

class _SignInState extends State<SignInPage> {
  Future signIn() async {
    final user = await GoogleSigninApi.login();
    if (user == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Sign in Failed')));
    } else {
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => MyHomePage(user: user)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Fenix')),
      body: Center(
        child: ElevatedButton(
          onPressed: signIn,
          child: Text('Sign in with Google'),
        ),
      ),
    );
  }
}
