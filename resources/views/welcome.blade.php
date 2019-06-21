<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

        <!-- Styles -->
        <link href="/css/welcome.css" rel="stylesheet"/>
    </head>
    <body>
        <div id="cover">
            <div id="overlay">

            </div>
        </div>
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @auth
                        <a href="{{ url('/expenses') }}">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" style="color:white">Login</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" style="color:white">Register</a>
                        @endif
                    @endauth
                </div>
            @endif

            <div class="content">
                <div class="title m-b-md">
                    GET DEV PROJECT
                </div>
                <p>Submitted by : Sikiru Moshood</p>
                <p>Email: sikirumoshood@gmail.com</p>

                
            </div>
        </div>
    </body>
</html>
