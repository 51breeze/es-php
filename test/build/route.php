<?php
use think\facade\Route;
Route::post('/method/:name/:age', 'Person/method');