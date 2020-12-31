<?php

require __DIR__ . '/../../php/classes/SqlQuery.php';

// 'db' folder needs to already exist

$db = new SqlQuery();
$db->query('CREATE TABLE IF NOT EXISTS "tasks" (
  "id" INTEGER NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "repeats" TEXT NOT NULL,
  "completed" TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
);');

//"duration" TEXT,

echo $db->status;
/*
echo "<br />";

$cooper = new SqlQuery();
$cooper->query('CREATE TABLE IF NOT EXISTS "supplies" (
  "id" INTEGER NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "task" INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
);');

echo $cooper->status;
*/
