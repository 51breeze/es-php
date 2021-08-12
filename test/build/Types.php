<?php
require_once('es/core/Object.php');
class Types extends \Object{
	public const ADDRESS = 0;
	public const NAME = 1;
	static public function getName($value){
		switch($value){
			case 0 : return 'ADDRESS';
			case 1 : return 'NAME';
			default: return null;
		}
	}
}