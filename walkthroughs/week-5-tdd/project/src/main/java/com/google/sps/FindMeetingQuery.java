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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class FindMeetingQuery {

  private ArrayList<TimeRange>
  resolveOverlaps(ArrayList<TimeRange> existingConflicts, TimeRange curEvent) {
    Collections.sort(existingConflicts, TimeRange.ORDER_BY_START);

    for (int curTime = 0; curTime < existingConflicts.size(); curTime++) {
      if (curEvent.overlaps(existingConflicts.get(curTime))) {
        int firstOverlap = curTime;
        while (curTime < existingConflicts.size() && curEvent.overlaps(existingConflicts.get(curTime))) {
            curTime++;
        }
        curTime--;
        existingConflicts.set(
            curTime,
            combineTimeRanges(curEvent, existingConflicts.get(curTime)));
        existingConflicts.subList(firstOverlap, curTime).clear();
        return existingConflicts;
      }
    }
    existingConflicts.add(curEvent);
    return existingConflicts;
  }

  private TimeRange combineTimeRanges(TimeRange t1, TimeRange t2) {
    int newStart = t1.start() < t2.start() ? t1.start() : t2.start();
    int newEnd = t1.end() > t2.end() ? t1.end() : t2.end();
    int newDuration = newEnd - newStart;
    return TimeRange.fromStartDuration(newStart, newDuration);
  }

  private ArrayList<TimeRange> invertTimeRange(ArrayList<TimeRange> t) {
    if (t.size() < 1) {
      t.add(TimeRange.WHOLE_DAY);
      return t;
    }
    ArrayList<TimeRange> inverted = new ArrayList<TimeRange>();
    int i = 0;
    if (t.get(i).start() != TimeRange.START_OF_DAY) {
      inverted.add(TimeRange.fromStartDuration(0, t.get(i).start()));
    }
    for (i = 1; i < t.size(); i++) {
      inverted.add(TimeRange.fromStartDuration(
          t.get(i - 1).end(), t.get(i).start() - t.get(i - 1).end()));
    }
    if (t.get(i - 1).end() != TimeRange.END_OF_DAY) {
      inverted.add(TimeRange.fromStartDuration(t.get(i - 1).end(),
                                               1440 - t.get(i - 1).end()));
    }
    return inverted;
  }

  private Boolean hasPersonOverlap(Collection<String> a, Collection<String> b) {
      for (String person : a) {
          if (b.contains(person)) {
            return true;
          }
      }
      return false;
  }

  public Collection<TimeRange> query(Collection<Event> events,
                                     MeetingRequest request) {
    // For a meeting longer than a day, no times are possible
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    // Get collection of people from MeetingRequest
    Collection<String> attendees = request.getAttendees();

    // With no attendees, the meeting can be held at any time
    if (attendees.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    ArrayList<TimeRange> combinedUnavailability = new ArrayList<TimeRange>();

    for (Event curEvent : events) {
      Set<String> eventAttendees = curEvent.getAttendees();
      if (hasPersonOverlap(attendees, eventAttendees)) {
        combinedUnavailability = resolveOverlaps(combinedUnavailability, curEvent.getWhen());          
      }
    }  

    // Extract available times by inverting unavailable array
    ArrayList<TimeRange> combinedAvailability =
        invertTimeRange(combinedUnavailability);

    // Remove slots which are too short for the meeting
    Iterator<TimeRange> itr = combinedAvailability.iterator();
    while (itr.hasNext()) {
      TimeRange tr = itr.next();
      if (tr.duration() < request.getDuration()) {
        itr.remove();
      }
    }

    return combinedAvailability;
  }
}