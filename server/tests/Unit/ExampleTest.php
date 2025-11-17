<?php

test('that true is true', function () {

    try {
        $res = env('DB_CONNECTION');
        dump($res);
    } catch (\Exception $e) {

        dump($e->getMessage());
    }
    expect(true)->toBeTrue();
});
