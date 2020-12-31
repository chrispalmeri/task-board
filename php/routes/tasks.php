<?php

require __DIR__ . '/../classes/SqlQuery.php';
require __DIR__ . '/../classes/ApiEndpoint.php';

class Endpoint extends ApiEndpoint {
  function get($input) {
    $db = new SqlQuery();

    $queryString = 'SELECT *,
      date("completed", "repeats") as \'next_due\'
    FROM "tasks"';

    // should just take any input key/values
    // and append them to the base query as a where statement
    if(!empty($input['id'])) {
      $id = $db->escape($input['id']);
      $queryString .= ' WHERE "id" = ' . $id;
    } elseif(!empty($input['filter'])) {
      $queryString .= ' WHERE "next_due" <= date(\'now\', \'localtime\')';
    }

    $queryString .= ' ORDER BY "next_due"';
    $db->query($queryString);
    return array($db->status, $db->result);
  }
  
  function post($input) {
    $db = new SqlQuery();

    $keys = array();
    $values = array();

    $whitelist = array(
      'description',
      'repeats',
      'completed',
    );

    foreach($input as $key => $value) {
      if(!empty($value) && in_array($key, $whitelist)) {
        $value = $db->escape($value);

        array_push($keys, '"' . $key . '"');
        array_push($values, '\'' . $value . '\'');
      }
    }

    if(in_array('"description"', $keys) && in_array('"repeats"', $keys)) {
      $qs = 'INSERT INTO "tasks" ( ' . implode(', ', $keys) . ' ) ';
      $qs .= 'VALUES ( ' . implode(', ', $values) . ' );';

      $db->query($qs);
      return array($db->status, $db->result);
    } else {
      return array(400, array(
        'error' => 'missing required "description" or "repeats"'
      ));
    }
  }

  function put($input) {
    if(!empty($input['id'])) {
      $db = new SqlQuery();
      $id = $db->escape($input['id']);

      $combined = array();

      $whitelist = array(
        'description',
        'repeats',
        'completed',
      );

      foreach($input as $key => $value) {
        if(!empty($value) && in_array($key, $whitelist)) {
          $value = $db->escape($value);

          array_push($combined, '"' . $key . '" = \'' . $value . '\'');
        }
      }

      if(count($combined) > 0) {
        $qs =  'UPDATE "tasks" SET ' . implode(', ', $combined) . '  WHERE "id" = ' . $id . ';';

        $db->query($qs);
        return array($db->status, $db->result);
      } else {
        return array(400, array(
          'error' => 'missing input'
        ));
      }
    } else {
      return array(405, array(
        'error' => 'method not allowed'
      ));
    }
  }

  function delete($input) {
    if(!empty($input['id'])) {
      $db = new SqlQuery();
      $id = $db->escape($input['id']);

      $db->query('DELETE FROM "tasks" WHERE "id" = ' . $id);

      return array($db->status, $db->result);
    } else {
      return array(405, array(
        'error' => 'method not allowed'
      ));
    }
  }
}
