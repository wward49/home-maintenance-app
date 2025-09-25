// utils/recurrence.js

// --- small helpers ---
const MS_DAY = 24 * 60 * 60 * 1000;
const pad2 = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const clampDay = (y, m1to12, day) => Math.min(day, new Date(y, m1to12, 0).getDate());
const DOW = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };

function nextWeekdayOnOrAfter(anchor, targetDow) {
  const a = startOfDay(anchor);
  const delta = (targetDow - a.getDay() + 7) % 7;
  return new Date(a.getFullYear(), a.getMonth(), a.getDate() + delta);
}

// --- expand a single task to all its dates in a given month ---
export function expandTaskOccurrencesForMonth(task, year, month1to12) {
  const first = new Date(year, month1to12 - 1, 1);
  const last  = new Date(year, month1to12, 0);
  const occurrences = [];

  const createdAt = new Date(task.createdAt ?? task.id ?? Date.now());
  const choice = task.userRepeatChoice;

  if (choice === 'weekly' || choice === 'biweekly') {
    const targetDow = DOW[task.dayOfWeekChoice ?? 'Sun'];
    // first matching weekday in this month
    let d = new Date(first);
    const delta = (targetDow - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + delta);

    // anchor for biweekly cadence
    const firstOccurFromAnchor = nextWeekdayOnOrAfter(createdAt, targetDow);
    const offset = Number(task.biweeklyOffset ?? 0); // 0=this week, 1=next

    for (let cur = d; cur <= last; cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 7)) {
      if (choice === 'biweekly') {
        const weeks = Math.floor((startOfDay(cur) - startOfDay(firstOccurFromAnchor)) / (7 * MS_DAY));
        if ((weeks + offset) % 2 !== 0) continue;
      }
      occurrences.push(ymd(cur));
    }
  } else if (choice === 'monthly') {
    const repeat = Number(task.monthlyRepeat || '1'); // 1=every month, 2=every other, etc.
    const wantDay = Number(task.dayOfMonthChoice || '1');

    // find base month index (first valid occurrence >= createdAt)
    const aY = createdAt.getFullYear();
    const aM = createdAt.getMonth(); // 0..11
    const clampedInA = clampDay(aY, aM + 1, wantDay);
    const occurThisMonth = new Date(aY, aM, clampedInA);
    const baseMonthIdx = (createdAt <= occurThisMonth) ? (aY * 12 + aM) : (aY * 12 + aM + 1);

    const targetMonthIdx = year * 12 + (month1to12 - 1);
    const diff = ((targetMonthIdx - baseMonthIdx) % repeat + repeat) % repeat;
    if (diff === 0) {
      const day = clampDay(year, month1to12, wantDay);
      occurrences.push(`${year}-${pad2(month1to12)}-${pad2(day)}`);
    }
  }

  return occurrences;
}

// --- build a map of date -> Set(taskId) for the visible month ---
export function buildMonthIndex(items, year, month1to12) {
  const map = new Map(); // dateString -> Set(taskId)
  for (const t of items) {
    const dates = expandTaskOccurrencesForMonth(t, year, month1to12);
    for (const ds of dates) {
      if (!map.has(ds)) map.set(ds, new Set());
      map.get(ds).add(t.id);
    }
  }
  return map;
}

// --- turn that map into react-native-calendars markedDates ---
export function computeMarkedDates(monthIndex, selectedTaskId, selectedDate) {
  const marks = {};
  // Base: color numbers on any day that has >=1 task
  for (const [ds] of monthIndex) {
    marks[ds] = {
      ...(marks[ds] || {}),
      customStyles: {
        ...(marks[ds]?.customStyles || {}),
        text: { color: '#2F80ED', fontWeight: '600' },
      },
    };
  }
  // Circles for selection
  if (selectedTaskId) {
    for (const [ds, setIds] of monthIndex) {
      if (setIds.has(selectedTaskId)) {
        marks[ds] = {
          ...(marks[ds] || {}),
          selected: true,
          selectedColor: '#5997caff',
          selectedTextColor: '#fff',
        };
      }
    }
  } else if (selectedDate) {
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: '#5997caff',
      selectedTextColor: '#fff',
    };
  }
  return marks;
}