<?php

class SqlQuery {

  public $db;
  public $status;
  public $result;

  function __construct() {
    $this->db = new SQLite3(__DIR__ . '/../../www/db/database.db');
  }

  function escape($value) {
    return $this->db->escapeString(trim($value));
  }
  
  function query($query) {
    $res = $this->db->query($query); // failures issue warning in log like: Unable to prepare statement

    if($res) { // command succeeded
      if($res->numColumns() > 0) { // result is in row format (even if there are no rows)
        $this->status = 200;
        $this->result = array();

        while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
          array_push($this->result, $row);
        }
      } elseif($this->db->lastInsertRowID()) { // return inserted id
        $this->status = 201;
        $this->result = array(
          'id' => $this->db->lastInsertRowID()
        );
      } else { // some other success
        $this->status = 204;
        $this->result = null;
      }
    } else {
      $this->status = 500;
      $this->result = array(
        'error' => $this->db->lastErrorMsg()
      );
    }

    $this->db->close();
  }
}
