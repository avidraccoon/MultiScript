standard_library = `
func string int_to_string(int value){
  @target("python") {
    return str(value)
  }
  @target("javascript"){
    return "" + value;
  }
}

func int string_to_int(string value){
  @target("python"){
    return int(value)
  }
}
`
