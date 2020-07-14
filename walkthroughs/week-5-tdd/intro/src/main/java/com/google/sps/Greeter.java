// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

/**
 * Utility class for creating greeting messages.
 */
public class Greeter {

  /**
   * Return the input with leading whitespace removed.
   */
  private StringBuilder removeSpaceFromFront(StringBuilder sb) {
    while (sb.length() > 0 && sb.charAt(0) == ' ') {
        sb.deleteCharAt(0);
    }
    return sb;
  }

  /**
   * Returns a greeting for the given name.
   */
  public String greet(String name) {
    StringBuilder sb = new StringBuilder();
    sb.append(name);
    sb = removeSpaceFromFront( removeSpaceFromFront(sb).reverse() ).reverse();

    // Remove characters that are neither letters nor spaces.
    for (int i = 0; i < sb.length(); i++) {
        char c = sb.charAt(i);
        if (!Character.isLetter(c) && c != ' ') {
            sb.deleteCharAt(i);
            i--;
        }
    }

    return "Hello " + sb.toString();
  }
}
