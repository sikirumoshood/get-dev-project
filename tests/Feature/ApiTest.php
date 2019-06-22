<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;
use App\Expenses;

class ApiTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    protected $invalidToken = "Bearer lkadd5334jlkjlj222aaadddccaddsaacasddd";

    

    private function getTestUser1(){
        $user = User::where('name','test')->first();
        return $user;
    }
    private function getTestUser2(){
        $user = User::where('name','test2')->first();
        return $user;
    }
    public function testTestRoute()
    {
        //Api_token must be provided
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest'])->json('GET','/api/expenses/test');

        $response->assertStatus(401);
       
    }

    public function testTestRoute2(){
        //Valid api token must be provided
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest','Authorization' => $this->invalidToken])->json('GET','/api/expenses/test');
        $response->assertStatus(401);
    }
    public function testGetExpensesNext(){
        //Can fetch up to 5 next expenses
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest','Authorization' =>'Bearer '.$this->getTestUser1()->api_token])->json('GET','/api/expenses/paginate/next/5');
        $response->assertStatus(200);
        
        $response->assertJsonStructure(['expenses'=>[],'paginate'=>[]]);
        
        $data = json_decode($response->getContent());
        $this->assertFalse($data->paginate->next);
        $this->assertFalse($data->paginate->prev);
        $this->assertCount(5, $data->expenses);
       

    }
    public function testGetExpensesNextEmpty(){
        //Can't fetch, no expenses for the user
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest','Authorization' =>'Bearer '.$this->getTestUser2()->api_token])->json('GET','/api/expenses/paginate/next/5');
        $response->assertStatus(200);
       
        $response->assertJsonStructure(['expenses'=>[],'paginate'=>[]]);
        
        $data = json_decode($response->getContent());
        $this->assertFalse($data->paginate->next);
        $this->assertFalse($data->paginate->prev);
        $this->assertEmpty($data->expenses);
       

    }
    public function testGetExpensesPrev(){
        //Can fetch previous expenses up to 5
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest','Authorization' =>'Bearer '.$this->getTestUser1()->api_token])->json('GET','/api/expenses/paginate/prev/5');
        $response->assertStatus(200);
      
        $response->assertJsonStructure(['expenses'=>[],'paginate'=>[]]);
        
        $data = json_decode($response->getContent());
        $this->assertFalse($data->paginate->next);
        $this->assertFalse($data->paginate->prev);
        $this->assertCount(5, $data->expenses);
    }
    public function testGetExpensesPrevEmpty(){
        //Cannot fetch previous expenses, user has none  
        $response = $this->withHeaders(['X-Requested-With'=> 'XMLHttpRequest','Authorization' =>'Bearer '.$this->getTestUser2()->api_token])->json('GET','/api/expenses/paginate/prev/5');
        $response->assertStatus(200);
        
        $response->assertJsonStructure(['expenses'=>[],'paginate'=>[]]);
        
        $data = json_decode($response->getContent());
        $this->assertFalse($data->paginate->next);
        $this->assertFalse($data->paginate->prev);
        $this->assertCount(0, $data->expenses);
    }
}
