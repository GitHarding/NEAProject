<?php

if(isset($_POST["submit"])){
    $name = filter_var ($_POST[pName])
    $score = (int) $_POST[pScore]

    $player = array("name" => $pName, "score" => $pScore);

    $currentScore = file_get_contents("scores.json");
    $currentData = json_decode($scoresJSON, true);
    $posting = array(
        'name' => $_POST['name'],
        'score' =>  $_POST['score']
    );
    $currentData[] = $posting;
    $finalData = json_encode($currentData)
    if(file_put_contents('Scores.json, $finalData')){
    
    }
    
}



?>