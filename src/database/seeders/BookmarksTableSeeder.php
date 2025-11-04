<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookmarksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $param = [
            'title' => 'タイトル1',
            'url' => 'http://title1.html'
        ];
        DB::table('bookmarks')->insert($param);
        $param = [
            'title' => 'タイトル2',
            'url' => 'http://title2.html'
        ];
        DB::table('bookmarks')->insert($param);
    }
}
