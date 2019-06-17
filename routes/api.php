<?php

use Illuminate\Http\Request;
use App\Expenses;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->get('/expenses',['headers'=>['Accept' => 'application/json']], function(Request $request){
  $exps = Expenses::all();
  return response()->json($exps);
});