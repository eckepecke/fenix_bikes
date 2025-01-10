import 'package:avec_flutter_app/home.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'map.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:github_oauth/github_oauth.dart';

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
      home: const MyLoginPage(),
    );
  }
}

class MyLoginPage extends StatefulWidget {
  const MyLoginPage({super.key});

  @override
  State<MyLoginPage> createState() => _MyLoginPageState();
}

class _MyLoginPageState extends State<MyLoginPage> {
  final gitHubSignIn = GitHubSignIn(
    clientId: dotenv.env['GITHUB_CLIENT_ID']!,
    clientSecret: dotenv.env['GITHUB_CLIENT_SECRET']!,
    redirectUrl: dotenv.env['GITHUB_REDIRECT_URL']!,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Fenix Login')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            final result = await gitHubSignIn.signIn(context);

            if (result.status == GitHubSignInResultStatus.ok) {
              // Successfully signed in
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => const MyHomePage()),
              // );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Token: ${result.token}')),
              );
            } else {
              // Error handling
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Error: ${result.errorMessage}')),
              );
            }
          },
          child: Text('Sign in with GitHub'),
        ),
      ),
    );
  }
}
