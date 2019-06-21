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


//All routes are private

//@description: just to test the api works
Route::get('/expenses/test', 'Api\ApiController@test');

//@description: Returns the total number of expenses
Route::get('/expenses/stat','Api\ApiController@stat');

//@description: Returns the next 5 expenses
Route::get('/expenses/paginate/next/{skip}','Api\ApiController@paginateNext');

//@description: Returns the prev 5 expenses for pagination
Route::get('/expenses/paginate/prev/{skip}','Api\ApiController@paginatePrev');



