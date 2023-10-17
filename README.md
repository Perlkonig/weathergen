# Fantasy Weather Generator

A simple approach to generating weather, including special events, for use in RPG campaigns.

Demo: <https://perlkonig.com/weather>

## Source

The underlying algorithm is from Todd Leback's book [_Into the Wild_](https://preview.drivethrurpg.com/en/product/353949/Into-the-Wild), released under the terms of the Open Game License Version 1.0a. The algorithm is not designed to mimic real-life weather patterns

## Usage

Simply enter a number of days you want generated, and a calendar will be populated that includes general weather conditions and special events. You can change the starting date if you wish, otherwise it defaults to January 1st of the current year. Adjusting for season and non-Gregorian calendars is an exercise for the GM.

You can export the resulting JSON so you can tweak it, and you can load the tweaked JSON back in.

Because random numbers, there are sometimes interesting overlaps of weather and other special events. The GM should take these as opportunities to be creative.

## Implementation Notes

The same generator seed and climate type will produce identical weather sequences. This is the most reliable way of continuing a long weather sequence in batches. There is no guarantee of reproducibility across version numbers. I will try to ensure breaks are signalled by major version number increases.

This generator disregards table 10, "Causes." Special events that have magical causes are flagged as `magical` in the description, but determining cause is left to the GM.

This generator disregards table 11, "Area of Weather," leaving it instead to the GM's discretion.

### All Special Events

-   Most effects have been simplified (i.e., made more generic), and as with everything, the GM should feel free to do what works for the campaign.
-   A duration of "permanent" is implemented as "100 years."
-   For simplicity, a "month" is exactly 30 days, and a "year" is exactly 365 days.

### Specific Special Events

-   Special 56-60, "Strong winds," will never cause a reroll of the weather.
-   Special 64-66, "Rain to hail," will never generate freak storms but will ensure the next generated rain storm is instead hail.
-   Special 67, "Drastic shift in weather patterns," poses challenges when generating weather in batches. To have the effect persist, you need to remember your generator seed and continually generate days from the beginning.
-   Specials 70, 71, and 73 calculate and report recurrence periods, but future events are not created automatically. But special 70, effect 5, is indeed implemented (special events become more common while the comet is present).
-   Special 73, effect 5-6, assumes meteorites striking the earth is checked for each day of the shower.
-   Special 74 is a one-day, one-off event.
-   Specials 77, 78, and 90 ("Solar eclipse" and "Rainbow") only occur between 9am and 5pm.
-   Special 79, "Lunar eclipse," and special 91, "Aurora," only occur between 6pm and 8am. Lunar eclipses usually occur during a full moon. If you already have a lunar calendar, feel free to move the eclipse to the next full moon.
-   Special 80, "Earthquake," is always scheduled for 15 minutes.
-   Special 85, "Tornados," only spawn between 1pm and 7pm.
-   Special 95, "Ball lightning," is somewhat vague. Here it works like specials 64–66; meaning, the next precipitation event is automatically upgraded to include ball lightning.
-   Specials 96, "Extended weather," and 97, "Changeable weather," are not implemented. They are treated the same as specials 99 and 100, which are placeholder specials for GM use. All four specials are created in the calendar as single-day "undefined" special events. Get creative!
