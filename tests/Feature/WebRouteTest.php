<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;

class WebRouteTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testExpensesRouteNoLogin()
    {
        $response = $this->get('/expenses');

        $response->assertStatus(302); //Redirects to login
    }
    public function testExpensesRouteLoggedIn()
    {
        $response = $this->actingAs(User::where('id',1)->first())->withSession(['email'=>'sikirumoshood@gmail.com'])->get('/expenses');

        $response->assertStatus(200); //logged in
        $response->assertSee('Add new expenses');
        $response->assertSee('Submitted expenses');
    }
    public function testCreateExpenseInvalid(){
        $response = $this->actingAs(User::where('id',5)->first())->withSession(['loggedIn'=>'true'])->post('/expenses',['exp_value'=>'non-valid','exp_value_pound'=>'3455','exp_reason'=>'Test','exp_date'=>'4456','exp_vat'=>'102']);
        $response->assertStatus(400);
    }
    public function testCreateExpenseValid(){
        $response = $this->actingAs(User::where('id',5)->first())->withSession(['loggedIn'=>'true'])->post('/expenses',['exp_value'=>'34555','exp_value_pound'=>'4567','exp_reason'=>'Test valid cost','exp_date'=>'2019-06-01','exp_vat'=>'102']);
        $response->assertStatus(200);
    }
}
