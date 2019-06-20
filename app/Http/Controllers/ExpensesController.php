<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExpensesController extends Controller
{
    public function __construct()
    {
        $this->middleware('verifyApiRequestToken');
      
    }

    
    public function index()
    {
        return view('dashboard');
    }


}
