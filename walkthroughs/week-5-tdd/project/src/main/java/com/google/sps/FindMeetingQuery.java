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
  /**
   * Add new TimeRange to ArrayList by either appending it or combining it with
   * existing TimeRange(s)
   */
  private ArrayList<TimeRange> resolveOverlaps(ArrayList<TimeRange> existingConflicts, 
                                               TimeRange curEvent) {
    // Check for overlaps between new event and existing unavailabilities
    for (int curTime = 0; curTime < existingConflicts.size(); curTime++) {
      // Since array is sorted chronologically, multiple overlaps will be
      // sequential
      if (curEvent.overlaps(existingConflicts.get(curTime))) {
        int firstOverlap = curTime;
        while (curTime < existingConflicts.size() &&
               curEvent.overlaps(existingConflicts.get(curTime))) {
          curTime++;
        }
        curTime--;

        // Insert new combined TimeRange in last overlapped position
        existingConflicts.set(
            curTime,
            combineTimeRanges(curEvent, existingConflicts.get(curTime)));
        // Delete other overlapped entries
        existingConflicts.subList(firstOverlap, curTime).clear();

        return existingConflicts;
      }
    }
    // No elements in array or no overlaps
    existingConflicts.add(curEvent);

    // Sort existing unavailabilities by chronological order of start time
    Collections.sort(existingConflicts, TimeRange.ORDER_BY_START);

    return existingConflicts;
  }

  /**
   * Return a single TimeRange spanning both input TimeRanges
   */
  private TimeRange combineTimeRanges(TimeRange t1, TimeRange t2) {
    int newStart = t1.start() < t2.start() ? t1.start() : t2.start();
    int newEnd = t1.end() > t2.end() ? t1.end() : t2.end();
    int newDuration = newEnd - newStart;
    return TimeRange.fromStartDuration(newStart, newDuration);
  }

  /**
   * Return the opposite of input TimeRange ArrayList
   */
  private ArrayList<TimeRange> invertTimeRange(ArrayList<TimeRange> t) {
    if (t.size() < 1) {
      t.add(TimeRange.WHOLE_DAY);
      return t;
    }
    ArrayList<TimeRange> inverted = new ArrayList<TimeRange>();
    int i = 0;
    if (t.get(i).start() != TimeRange.START_OF_DAY) {
      inverted.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY,
                                          t.get(i).start(), false));
    }
    for (i = 1; i < t.size(); i++) {
      inverted.add(
          TimeRange.fromStartEnd(t.get(i - 1).end(), t.get(i).start(), false));
    }
    if (t.get(i - 1).end() != TimeRange.END_OF_DAY) {
      inverted.add(TimeRange.fromStartEnd(t.get(i - 1).end(),
                                          TimeRange.END_OF_DAY, true));
    }
    return inverted;
  }

  /**
   * Returns whether any person is present in both input Collections
   */
  private Boolean hasPersonOverlap(Collection<String> a, Collection<String> b) {
    for (String person : a) {
      if (b.contains(person)) {
        return true;
      }
    }
    return false;
  }

  /**
   * From events, a select set of attendees, and a given meeting duration,
   * return all suitable TimeRanges 
   */
  private ArrayList<TimeRange> combineAvailability(Collection<Event> events,
                                                   Collection<String> attendees,
                                                   long duration) {
    ArrayList<TimeRange> combinedUnavailability = new ArrayList<TimeRange>();

    // Combine all events into one array of unsuitable TimeRanges
    for (Event curEvent : events) {
      Set<String> eventAttendees = curEvent.getAttendees();
      // Only account for people attending meeting
      if (hasPersonOverlap(attendees, eventAttendees)) {
        combinedUnavailability =
            resolveOverlaps(combinedUnavailability, curEvent.getWhen());
      }
    }

    // Extract available times by inverting unavailable array
    ArrayList<TimeRange> combinedAvailability =
        invertTimeRange(combinedUnavailability);

    // Remove slots which are too short for the meeting
    Iterator<TimeRange> itr = combinedAvailability.iterator();
    while (itr.hasNext()) {
      TimeRange tr = itr.next();
      if (tr.duration() < duration) {
        itr.remove();
      }
    }
    return combinedAvailability;
  }

  /**
   * Return the TimeRanges available for all meeting members given existing
   * events
   */
  public Collection<TimeRange> query(Collection<Event> events,
                                     MeetingRequest request) {
    // For a meeting longer than a day, no times are possible
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    // Get collections of people from MeetingRequest
    Collection<String> attendees = request.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();

    // With no attendees, the meeting can be held at any time
    if (attendees.isEmpty() && optionalAttendees.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    long duration = request.getDuration();

    // If either group is empty, only need to consider the other
    if (attendees.isEmpty() || optionalAttendees.isEmpty()) {
      Collection<String> nonEmptyAttendees =
          attendees.isEmpty() ? optionalAttendees : attendees;
      return combineAvailability(events, nonEmptyAttendees, duration);
    }

    ArrayList<TimeRange> mandatoryAvailability =
        combineAvailability(events, attendees, duration);

    // If there are no open slots between mandatory attendees,
    // no need to consider optional attendees 
    if (mandatoryAvailability.isEmpty()) {
      return mandatoryAvailability;
    }

    // Not allowed to append directly to attendees Collection since
    // it is returned as an unmodifiable Collection
    ArrayList<String> newAttendance = new ArrayList<String>();
    for (String person : attendees) {
        newAttendance.add(person);
    }
    for (String person : optionalAttendees) {
        newAttendance.add(person);
    }
    
    ArrayList<TimeRange> allAvailability =
        combineAvailability(events, newAttendance, duration);

    // Basic optional attendee implementation
    // all or nothing: if no slots exist such that ALL mandatory and 
    // optional attendees can attend, return the slots for only 
    // mandatory attendees
    if (allAvailability.isEmpty()) {
        return mandatoryAvailability;
    }

    return allAvailability;
  }
}