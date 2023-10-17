import { nanoid } from "nanoid";
import Prando from "prando";

export interface ExtProps {
    description?: string;
}
export interface CalendarEvent {
    id: string;
    allDay: boolean;
    start: Date;
    end: Date;
    title: string;
    backgroundColor?: string;
    textColor?: string;
    extendedProps?: ExtProps;
}

export const genWeather = (
    seed: string,
    numDays: number,
    startDate: Date,
    climate: "arid" | "temperate" | "tropical" = "temperate",
): CalendarEvent[] => {
    const rng = new Prando(seed);
    const events: CalendarEvent[] = [];

    // tracking variables needed for some specials
    let hailstorm: "small" | "medium" | "large" | undefined = undefined;
    let ballLightning: number | undefined = undefined;
    let spec67: "increase" | "decrease" | undefined = undefined;
    let spec67Days = 0;
    let magicalRain: string | undefined = undefined;
    let spec70Days = 0;
    // end tracking variables

    const multiRoll = (num: number, face: number): number => {
        let result = 0;
        for (let i = 0; i < num; i++) {
            result += rng.nextInt(1, face);
        }
        return result;
    };

    const genMeteorStrikes = (days = 1): string => {
        let strikes: number[] = [];
        for (let d = 0; d < days; d++) {
            const n = rng.nextInt(1, 100);
            for (let i = 0; i < n; i++) {
                if (rng.nextInt(1, 100) === 1) {
                    const sizes = rng.nextInt(1, 6);
                    switch (sizes) {
                        case 1:
                            strikes.push(rng.nextInt(1, 8));
                            break;
                        case 2:
                        case 3:
                            strikes.push(multiRoll(4, 4));
                            break;
                        case 4:
                        case 5:
                            strikes.push(rng.nextInt(1, 4) * 16);
                            break;
                        case 6:
                            strikes.push(multiRoll(2, 20) * 16);
                            break;
                    }
                }
            }
        }
        let result = `Over the course of the ${days} day${
            days !== 1 ? "s" : ""
        } shower, ${strikes.length} meteor${
            strikes.length !== 1 ? "s" : ""
        } reached the ground.`;
        if (strikes.length > 0) {
            const total = strikes.reduce((acc, curr) => (acc += curr), 0);
            const min = Math.min(...strikes);
            const max = Math.max(...strikes);
            result += ` The total mass of fallen starmetal was ${total} ounce${
                total !== 1 ? "s" : ""
            } (~${total / 16} pound${
                total / 16 !== 1 ? "s" : ""
            }). The smallest strike was ${min} ounce${
                min !== 1 ? "s" : ""
            }, and the largest was ${max} ounce${max !== 1 ? "s" : ""} (~${
                max / 16
            } pound${max / 16 !== 1 ? "s" : ""}).`;
        }
        return result;
    };

    interface PrecipType {
        start: number;
        duration: number;
        nature: string;
    }

    const calcRain = (): PrecipType => {
        const startHour = rng.nextInt(0, 24);
        const precipType = rng.nextInt(1, 20);
        const precipObj = {
            start: startHour,
            duration: 0,
            nature: "rain, mild",
        };
        switch (precipType) {
            case 1:
                precipObj.nature = "rain, violent";
                precipObj.duration = multiRoll(6, 6);
                break;
            case 2:
            case 3:
            case 4:
                precipObj.nature = "rain, moderate";
                precipObj.duration = multiRoll(6, 6);
                break;
            case 5:
            case 6:
            case 7:
                precipObj.duration = multiRoll(6, 6);
                break;
            case 8:
                precipObj.nature = "rain, violent";
                precipObj.duration = rng.nextInt(1, 6);
                break;
            case 9:
            case 10:
            case 11:
                precipObj.nature = "rain, moderate";
                precipObj.duration = rng.nextInt(1, 6);
                break;
            case 12:
            case 13:
            case 14:
                precipObj.duration = rng.nextInt(1, 6);
                break;
            case 15:
                precipObj.nature = "rain, violent";
                precipObj.duration = multiRoll(3, 20) / 60;
                break;
            case 16:
            case 17:
            case 18:
                precipObj.nature = "rain, moderate";
                precipObj.duration = multiRoll(3, 20) / 60;
                break;
            case 19:
            case 20:
                precipObj.duration = multiRoll(3, 20) / 60;
                break;
        }

        if (precipObj.nature === "rain, mild") {
            const variant = rng.nextInt(1, 6);
            if (variant === 1) {
                precipObj.nature = "thick fog";
            } else {
                if (ballLightning !== undefined) {
                    precipObj.nature += ` (ball lightning [${ballLightning} orb${
                        ballLightning === 1 ? "" : "s"
                    }])`;
                } else if (rng.nextInt(1, 100) <= 10) {
                    precipObj.nature += ` (lightning)`;
                }
                if (rng.nextInt(1, 100) <= 10) {
                    precipObj.nature += ` (high winds [${multiRoll(
                        4,
                        6,
                    )} mph gusts])`;
                }
                if (hailstorm !== undefined) {
                    precipObj.nature += ` (freak hail storm, ${hailstorm} hails)`;
                }
            }
        } else if (precipObj.nature === "rain, moderate") {
            if (ballLightning !== undefined) {
                precipObj.nature += ` (ball lightning [${ballLightning} orb${
                    ballLightning === 1 ? "" : "s"
                }])`;
            } else if (rng.nextInt(1, 100) <= 25) {
                precipObj.nature += ` (lightning)`;
            }
            if (rng.nextInt(1, 100) <= 30) {
                precipObj.nature += ` (high winds [${multiRoll(
                    8,
                    6,
                )} mph gusts])`;
            }
            if (rng.nextInt(1, 100) <= 5 || hailstorm !== undefined) {
                if (hailstorm !== undefined) {
                    precipObj.nature += ` (freak hail storm, ${hailstorm} hails)`;
                } else {
                    precipObj.nature += ` (hail/sleet)`;
                }
            }
        } else {
            // must be violent
            if (ballLightning !== undefined) {
                precipObj.nature += ` (ball lightning [${ballLightning} orb${
                    ballLightning === 1 ? "" : "s"
                }])`;
            } else if (rng.nextInt(1, 100) <= 50) {
                precipObj.nature += ` (lightning)`;
            }
            if (rng.nextInt(1, 100) <= 60) {
                precipObj.nature += ` (high winds [${multiRoll(
                    8,
                    20,
                )} mph gusts])`;
            }
            if (rng.nextInt(1, 100) <= 10 || hailstorm !== undefined) {
                if (hailstorm !== undefined) {
                    precipObj.nature += ` (freak hail storm, ${hailstorm} hails)`;
                } else {
                    precipObj.nature += ` (hail/sleet)`;
                }
            }
        }

        return precipObj;
    };

    for (let day = 0; day < numDays; day++) {
        let today = new Date(startDate);
        today.setDate(today.getDate() + day);
        let overall = rng.nextInt(1, 20);

        if (
            overall === 1 ||
            overall === 20 ||
            (spec70Days > 0 && (overall === 2 || overall === 19))
        ) {
            const special = rng.nextInt(1, 100);
            if (special <= 20) {
                let duration = rng.nextInt(1, 6);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const end = new Date(today);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: "Unseasonably warm (+10 degrees)",
                    start: today,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 40) {
                let duration = rng.nextInt(1, 6);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const end = new Date(today);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: "Unseasonably cool (-10 degrees)",
                    start: today,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 45) {
                let duration = rng.nextInt(1, 4);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const isMagical = rng.nextInt(1, 6) === 1;
                const end = new Date(today);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Unseasonably hot (+11-20 degrees${
                        isMagical ? "; magical cause" : ""
                    })`,
                    start: today,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 50) {
                let duration = rng.nextInt(1, 4);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const isMagical = rng.nextInt(1, 6) === 1;
                const end = new Date(today);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Unseasonably cold (-11-20 degrees${
                        isMagical ? "; magical cause" : ""
                    })`,
                    start: today,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 55) {
                if (rng.nextInt(1, 6) === 1) {
                    const start = new Date(today);
                    const days = rng.nextInt(1, 6) + 1;
                    const end = new Date(start);
                    end.setDate(start.getDate() + days);
                    events.push({
                        id: nanoid(),
                        allDay: true,
                        title: `No wind (becalmed)`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                } else {
                    const hour = rng.nextInt(0, 23);
                    const start = new Date(today);
                    start.setHours(hour);
                    const duration = rng.nextInt(1, 24);
                    const end = new Date(
                        start.getTime() + duration * 60 * 60 * 1000,
                    );
                    events.push({
                        id: nanoid(),
                        allDay: false,
                        title: `No wind (becalmed)`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                }
            } else if (special <= 60) {
                let duration = rng.nextInt(1, 12);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const speed = rng.nextInt(1, 20) + 20;
                const startHour = rng.nextInt(0, 23);
                const start = new Date(today);
                start.setHours(startHour);
                const end = new Date(
                    start.getTime() + duration * 60 * 60 * 1000,
                );
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Strong winds (+${speed} mph)`,
                    start,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 63) {
                let duration = rng.nextInt(1, 8);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const speed = multiRoll(2, 20) + 60;
                const startHour = rng.nextInt(0, 23);
                const start = new Date(today);
                start.setHours(startHour);
                const end = new Date(
                    start.getTime() + duration * 60 * 60 * 1000,
                );
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Very strong winds (+${speed} mph)`,
                    start,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special <= 66) {
                let size: "small" | "medium" | "large" = "small";
                const roll = rng.nextInt(1, 6);
                if (roll === 6) {
                    size = "large";
                } else if (roll >= 4) {
                    size = "medium";
                }
                hailstorm = size;
            } else if (special === 67) {
                const duration = rng.nextInt(1, 6);
                const direction = rng.nextInt(1, 6);
                if (direction < 4) {
                    spec67 = "increase";
                } else {
                    spec67 = "decrease";
                }
                switch (duration) {
                    case 1:
                    case 2:
                        spec67Days = 7;
                        break;
                    case 3:
                        spec67Days = 30;
                        break;
                    case 4:
                        spec67Days = 365;
                        break;
                    case 5:
                        spec67Days = 3650;
                        break;
                    case 6:
                        spec67Days = 36500;
                        break;
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + spec67Days);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Drastic change in weather patterns (${spec67} in chance of rain)`,
                    start,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special === 68) {
                const roll = rng.nextInt(1, 6);
                switch (roll) {
                    case 1:
                        magicalRain =
                            "beneficial to the growth of plants, maybe doubling crop yields for the next harvest";
                        break;
                    case 2:
                        magicalRain =
                            "detrimental to the growth of plants, maybe halving crop yields for the next harvest";
                        break;
                    case 3:
                        magicalRain =
                            "leaves a slimy mucus on all surfaces that lasts for a few hours before evaporating";
                        break;
                    case 4:
                        magicalRain =
                            "evaporates instantly upon falling, leaving surfaces dry";
                        break;
                    case 5:
                        const holy = rng.nextBoolean();
                        magicalRain = `rains a weak ${
                            holy ? "holy" : "unholy"
                        } water`;
                        break;
                    case 6:
                        magicalRain =
                            "causes non-magical items to rust instantly";
                        break;
                }
            } else if (special === 69) {
                const wider = rng.nextBoolean();
                const duration = rng.nextInt(1, 6);
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Weather patterns affect a ${
                        wider ? "larger" : "smaller"
                    } area than usual`,
                    start,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special === 70) {
                let duration = rng.nextInt(1, 6);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const augur = rng.nextInt(1, 6);
                const period = rng.nextInt(1, 12);
                let description = "";
                switch (augur) {
                    case 1:
                    case 2:
                    case 3:
                        description += "The comet has no effect.";
                        break;
                    case 4:
                        description += "The comet augurs strife and war.";
                        break;
                    case 5:
                        description +=
                            "Unusual weather events are more likely while the comet is present.";
                        spec70Days = duration;
                        break;
                    case 6:
                        description +=
                            "The comet increases tensions and negative emotions, but only when the comet is visible.";
                        break;
                }
                switch (period) {
                    case 1:
                        description += " This is a unique occurrence.";
                        break;
                    case 2:
                        description += ` This comet appears every ${multiRoll(
                            3,
                            4,
                        )} months.`;
                        break;
                    case 3:
                    case 4:
                    case 5:
                        const roll = rng.nextInt(1, 10);
                        description += ` This comet appears every ${roll} year${
                            roll !== 1 ? "s" : ""
                        }.`;
                        break;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        description += ` This comet appears every ${multiRoll(
                            10,
                            10,
                        )} years.`;
                        break;
                    case 12:
                        description += ` This comet appears every ${
                            rng.nextInt(1, 10) * 100
                        } years.`;
                        break;
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A comet appears that is visible only at night`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 71) {
                let duration = rng.nextInt(1, 6);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const augur = rng.nextInt(1, 6);
                const period = rng.nextInt(1, 12);
                let description = "";
                switch (augur) {
                    case 1:
                        description += "The comet has no effect.";
                        break;
                    case 2:
                        description +=
                            "The comet is an omen that a prominent and ancient family line will end.";
                        break;
                    case 3:
                        description +=
                            "The comet foretells the birth of an important person.";
                        break;
                    case 4:
                        description +=
                            "The comet presages the waking of a potent evil, buried for centuries.";
                        break;
                    case 5:
                        const roll = rng.nextInt(1, 6);
                        description += `When acts of violence are bathed in the light of the comet, damage rolls are ${
                            roll <= 4 ? "increased" : "decreased"
                        }.`;
                        break;
                    case 6:
                        description +=
                            "The comet causes magic to behave in unpredictable ways while present.";
                        break;
                }
                switch (period) {
                    case 1:
                        description += " This is a unique occurrence.";
                        break;
                    case 2:
                        description += ` This comet appears every ${multiRoll(
                            3,
                            4,
                        )} months.`;
                        break;
                    case 3:
                    case 4:
                    case 5:
                        const roll = rng.nextInt(1, 10);
                        description += ` This comet appears every ${roll} year${
                            roll !== 1 ? "s" : ""
                        }.`;
                        break;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        description += ` This comet appears every ${multiRoll(
                            10,
                            10,
                        )} years.`;
                        break;
                    case 12:
                        description += ` This comet appears every ${
                            rng.nextInt(1, 10) * 100
                        } years.`;
                        break;
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A comet appears that is visible both day and night`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 72) {
                const appeared = rng.nextBoolean();
                const augur = rng.nextInt(1, 6);
                let description = "";
                switch (augur) {
                    case 1:
                        description = `Signifies the death/birth of a great force for ${
                            rng.nextBoolean() ? "Law" : "Chaos"
                        } on the mortal plane.`;
                        break;
                    case 2:
                        description = `Marks the ${
                            rng.nextBoolean()
                                ? "death of a diety"
                                : "birth of a new diety"
                        }.`;
                        break;
                    case 3:
                        description = `${
                            appeared ? "Strengthens" : "Weakens"
                        } the boundaries between the planes.`;
                        break;
                    case 4:
                        description = `Affects the turning (or perhaps some other feature) of the undead.`;
                        break;
                    case 5:
                        description = `Signifies the onset of a period of ${
                            appeared ? "increase" : "reduction"
                        } in the activities of a particular type of monster.`;
                        break;
                    case 6:
                        description = `This is a natural occurrence and signifies nothing.`;
                        break;
                }
                const durationRoll = rng.nextInt(1, 8);
                let duration = 0;
                switch (durationRoll) {
                    case 1:
                    case 2:
                        duration = rng.nextInt(1, 6);
                        break;
                    case 3:
                    case 4:
                        duration = rng.nextInt(1, 6) * 7;
                        break;
                    case 5:
                    case 6:
                        duration = rng.nextInt(1, 12) * 30;
                        break;
                    case 7:
                        duration = rng.nextInt(1, 10) * 365;
                        break;
                    case 8:
                        duration = rng.nextInt(1, 10) * 365 * 100;
                        break;
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A star has ${
                        appeared ? "appeared in" : "disappeared from"
                    } the night sky`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 73) {
                const visibility = rng.nextInt(1, 6);
                let duration = rng.nextInt(1, 4);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                let description = "";
                const cause = rng.nextInt(1, 6);
                switch (cause) {
                    case 1:
                        description =
                            "Causes the recent dead to rise as zombies.";
                        break;
                    case 2:
                        description = "Brings a space plague.";
                        break;
                    case 3:
                        description = "Rains fiery death upon a region.";
                        break;
                    case 4:
                        description = `The meteors house alien life. They ${
                            rng.nextInt(1, 6) <= 2 ? "come" : "do *not* come"
                        } in peace.`;
                        break;
                    case 5:
                    case 6:
                        description = genMeteorStrikes(duration);
                        break;
                }
                const period = rng.nextInt(1, 12);
                switch (period) {
                    case 1:
                        description += " This is a unique occurrence.";
                        break;
                    case 2:
                        description += ` This storm appears every ${multiRoll(
                            3,
                            4,
                        )} months.`;
                        break;
                    case 3:
                    case 4:
                    case 5:
                        const roll = rng.nextInt(1, 10);
                        description += ` This storm appears every ${roll} year${
                            roll !== 1 ? "s" : ""
                        }.`;
                        break;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        description += ` This storm appears every ${multiRoll(
                            10,
                            10,
                        )} years.`;
                        break;
                    case 12:
                        description += ` This storm appears every ${
                            rng.nextInt(1, 10) * 100
                        } years.`;
                        break;
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A meteor storm appears that is visible ${
                        visibility === 6
                            ? "both in the day and at night"
                            : "only at night"
                    }.`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 74) {
                let description = genMeteorStrikes();
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A freak one-day meteor storm occurs that is not visible. But maybe something valuable fell to earth?`,
                    start: today,
                    end: today,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 75) {
                const duration = rng.nextInt(1, 6);
                const destruction = multiRoll(3, 10);
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A forest fire burns ${destruction} square miles of forest per day if not stopped.`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description:
                            "Light rain has a 25% chance of extinguishing the fire per day of rain, moderate rain has a 25% chance per four hours of rain, and heavy rain has a 25% chance per hour.",
                    },
                });
            } else if (special === 76) {
                const effect = rng.nextInt(1, 3);
                let description = "";
                switch (effect) {
                    case 1:
                        description =
                            "Augurs ill for all who can see the colour (e.g., convert natural 20s to 1s)";
                        break;
                    case 2:
                        description = "Causes mass confusion among wildlife";
                        break;
                    case 3:
                        description =
                            "Babies born during this time bear marks that resemble the the changed colour";
                        break;
                }
                const hour = rng.nextInt(0, 23);
                let duration = rng.nextInt(1, 12);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(
                    start.getTime() + duration * 60 * 60 * 1000,
                );
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `The sky turns an unusual (unnatural?) colour`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 77) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description =
                            "Barriers between the worlds are weakened";
                        break;
                    case 2:
                        description = "Undead grow more powerful";
                        break;
                    case 3:
                        description = "High-level cleric spells are blocked";
                        break;
                    case 4:
                        description = `Magic generally is ${
                            rng.nextBoolean() ? "enhanced" : "hampered"
                        }`;
                        break;
                    case 5:
                    case 6:
                        description =
                            "Nothing unusual, but try not to look directly at it";
                        break;
                }
                const hour = rng.nextInt(9, 17);
                let minutes = rng.nextInt(1, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Partial solar eclipse`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 78) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description = "Non-magical fires sputter and go out";
                        break;
                    case 2:
                        description =
                            "The barriers between worlds totally collapse";
                        break;
                    case 3:
                        description =
                            "Undead (like vampires) can travel safely during the eclipse";
                        break;
                    case 4:
                        description = `All saving throws receive a ${
                            rng.nextBoolean() ? "penalty" : "bonus"
                        }`;
                        break;
                    case 5:
                    case 6:
                        description =
                            "Nothing unusual, but try not to look directly at it";
                        break;
                }
                const hour = rng.nextInt(9, 17);
                let minutes = rng.nextInt(1, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Full solar eclipse`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 79) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description = "Wounds do not heal by natural means";
                        break;
                    case 2:
                        description =
                            "Lycanthropic activity is especially pronounced";
                        break;
                    case 3:
                        description =
                            "It is a time to commune with the spirits";
                        break;
                    case 4:
                    case 5:
                    case 6:
                        description = "Nothing unusual happens";
                        break;
                }
                const hour = (18 + rng.nextInt(0, 14)) % 24;
                const minutes = multiRoll(4, 20);
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Lunar eclipse`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 80) {
                const severity = rng.nextInt(1, 12);
                let adj = "";
                let description = "";
                switch (severity) {
                    case 1:
                    case 2:
                    case 3:
                        adj = "mild";
                        description =
                            "The ground shakes slightly, but not quite strongly enough to knock paintings off of walls.";
                        break;
                    case 4:
                    case 5:
                    case 6:
                        adj = "minor";
                        description =
                            "The ground shakes with enough force to rattle plates on shelves and knock poorly hung paintings off walls. No damage to buildings, unless they’re poorly built.";
                        break;
                    case 7:
                    case 8:
                        adj = "strong";
                        description =
                            "Objects will likely fall, buildings sustain minor damage. At the epicenter of the quake, a small rift in the earth may open.";
                        break;
                    case 9:
                    case 10:
                        adj = "major";
                        description =
                            "Objects are knocked from shelves, buildings take structural damage. A large rift in the earth may open up at the epicenter of the quake. Standing adventurers may be knocked off their feet.";
                        break;
                    case 11:
                        adj = "severe";
                        description =
                            "Buildings suffer significant structural damage. Fires may start in densely inhabited areas. Standing adventurers may be knocked off their feet. Streams and small rivers may have their courses shifted, and a large rift may open near the epicenter.";
                        break;
                    case 12:
                        adj = "once in a lifetime";
                        description =
                            "Once-in-a-lifetime quake. Buildings suffer massive damage. There is a good chance of fires starting in densely inhabited areas. There is an even chance that major rivers shift course. Standing adventurers will almost certainly be knocked off their feet.";
                        break;
                }
                const effect = rng.nextInt(1, 6);
                switch (effect) {
                    case 1:
                    case 2:
                        description +=
                            " There are no additional special effects.";
                        break;
                    case 3:
                        description +=
                            " Some ancient evil or imprisoned monster is released.";
                        break;
                    case 4:
                        description += " A long-lost ruin or tomb is revealed.";
                        break;
                    case 5:
                        description +=
                            " A portal to the elemental plane of earth is opened (potentially only temporarily).";
                        break;
                    case 6:
                        description +=
                            " A previously undiscovered vein of valuable ore or minerals is uncovered.";
                        break;
                }
                const hour = rng.nextInt(0, 23);
                const minutes = 15;
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Earthquake (${adj})`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 81) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description =
                            "The wind brings a smell of jasmine or other exotic spice.";
                        break;
                    case 2:
                        description =
                            "The wind brings the smell of the ocean, even if there is not one nearby.";
                        break;
                    case 3:
                        description =
                            "The wind brings the smell of charnel, of the slaughter house.";
                        break;
                    case 4:
                        description =
                            "The wind brings a light dusting of ash, as if from a fire.";
                        break;
                    case 5:
                        description =
                            "The wind brings whispering voices, speaking in unknown tongues.";
                        break;
                    default:
                        description = "The wind is unremarkable.";
                        break;
                }
                const hour = rng.nextInt(0, 23);
                const hours = rng.nextInt(1, 24);
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `The prevailing winds change direction for a time`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 82) {
                const subRoll = rng.nextInt(1, 6);
                let substance = "";
                switch (subRoll) {
                    case 1:
                        substance = "frogs";
                        break;
                    case 2:
                        substance = "snakes";
                        break;
                    case 3:
                        substance = "locusts";
                        break;
                    case 4:
                        substance = "blood";
                        break;
                    case 5:
                        substance = "fish";
                        break;
                    case 6:
                        substance = "flowers";
                        break;
                }
                const precip = calcRain();
                const wHour = new Date(today);
                wHour.setHours(precip.start);
                let endTime: Date = wHour;
                if (precip.duration < 1) {
                    const minutes = Math.round(precip.duration * 60);
                    endTime = new Date(wHour.getTime() + minutes * 60 * 1000);
                } else {
                    endTime = new Date(
                        wHour.getTime() + precip.duration * 60 * 60 * 1000,
                    );
                }
                const rainEvent: CalendarEvent = {
                    id: nanoid(),
                    allDay: false,
                    title: `Rain of ${substance}, with no clouds in sight! ${precip.nature}`,
                    start: wHour,
                    end: endTime,
                    backgroundColor: "#800020",
                };
                events.push(rainEvent);
            } else if (special === 83) {
                const hour = rng.nextInt(0, 23);
                const minutes = multiRoll(3, 4);
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Extremely heavy rains inundate the area`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description:
                            "Heavy rains inundate the area, dropping a quarter inch of rain per minute. Flash floods are a danger in ravines, creek beds, and low-lying areas.",
                    },
                });
            } else if (special === 84) {
                const devils = rng.nextInt(1, 6) === 1;
                let minutes = multiRoll(3, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                const hour = rng.nextInt(0, 23);
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Strong winds whip through the region, ${
                        devils
                            ? "generating live air elementals!"
                            : 'creating mundane "dirt devils.".'
                    }`,
                    start,
                    end,
                    backgroundColor: "#800020",
                });
            } else if (special === 85) {
                const effectRoll = rng.nextInt(1, 6);
                let description = "";
                switch (effectRoll) {
                    case 1:
                        description =
                            "The tornadoes are in fact rampaging air elementals who will attack all living creatures they come across.";
                        break;
                    case 2:
                        description =
                            "The tornadoes conceal a portal to another plane.";
                        break;
                    case 3:
                        description =
                            "The tornadoes do no damage but do some other unusual thing instead (e.g., suck up all the colour from a region).";
                        break;
                    default:
                        description = "The tornadoes are ordinary.";
                        break;
                }
                let minutes = multiRoll(4, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                let n = rng.nextInt(1, 12);
                if (rng.nextInt(1, 6) === 1) {
                    n *= 2;
                }
                const hour = rng.nextInt(13, 19);
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `${n} tornado${n !== 1 ? "es" : ""} spawn`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 86) {
                const durationRoll = rng.nextInt(1, 3);
                const shapeRoll = rng.nextInt(1, 6);
                let shape = "";
                switch (shapeRoll) {
                    case 1:
                        shape = "specific individuals or creatures";
                        break;
                    case 2:
                        shape = "scenes from history";
                        break;
                    case 3:
                        shape = "events that may occur in the future";
                        break;
                    case 4:
                        shape = "words or runes in an known language";
                        break;
                    case 5:
                        shape = "words or runes in an unknown language";
                        break;
                    case 6:
                        shape = "the players themselves";
                        break;
                }
                if (durationRoll === 1) {
                    const hour = rng.nextInt(0, 23);
                    const minutes = 15;
                    const start = new Date(today);
                    start.setHours(hour);
                    const end = new Date(start.getTime() + minutes * 60 * 1000);
                    events.push({
                        id: nanoid(),
                        allDay: false,
                        title: `The clouds form recognizeable shapes (${shape})`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                } else if (durationRoll === 2) {
                    const hour = rng.nextInt(0, 23);
                    const hours = 3;
                    const start = new Date(today);
                    start.setHours(hour);
                    const end = new Date(
                        start.getTime() + hours * 60 * 60 * 1000,
                    );
                    events.push({
                        id: nanoid(),
                        allDay: false,
                        title: `The clouds form recognizeable shapes (${shape})`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                } else {
                    events.push({
                        id: nanoid(),
                        allDay: true,
                        title: `The clouds form recognizeable shapes (${shape})`,
                        start: today,
                        end: today,
                        backgroundColor: "#800020",
                    });
                }
            } else if (special === 87) {
                const durationRoll = rng.nextInt(1, 3);

                if (durationRoll === 1) {
                    const hour = rng.nextInt(0, 23);
                    const minutes = 15;
                    const start = new Date(today);
                    start.setHours(hour);
                    const end = new Date(start.getTime() + minutes * 60 * 1000);
                    events.push({
                        id: nanoid(),
                        allDay: false,
                        title: `The clouds are an unusual colour`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                } else if (durationRoll === 2) {
                    const hour = rng.nextInt(0, 23);
                    const hours = 3;
                    const start = new Date(today);
                    start.setHours(hour);
                    const end = new Date(
                        start.getTime() + hours * 60 * 60 * 1000,
                    );
                    events.push({
                        id: nanoid(),
                        allDay: false,
                        title: `The clouds are an unusual colour`,
                        start,
                        end,
                        backgroundColor: "#800020",
                    });
                } else {
                    events.push({
                        id: nanoid(),
                        allDay: true,
                        title: `The clouds are an unusual colour`,
                        start: today,
                        end: today,
                        backgroundColor: "#800020",
                    });
                }
            } else if (special === 88) {
                let description = "";
                const status = rng.nextInt(1, 3);
                if (status === 1) {
                    description += "The city is inhabited.";
                } else if (status === 2) {
                    description +=
                        "The city is abandoned (but not necessarily empty).";
                } else {
                    description += "The city is an illusion.";
                }
                const substance = rng.nextInt(1, 3);
                if (substance === 1) {
                    description += " The city is composed of cloud stuff.";
                } else if (substance === 2) {
                    description += " The city is made of stone and earth.";
                } else {
                    description += " The city is spun from magic itself.";
                }
                if (rng.nextInt(1, 6) === 1) {
                    const days = rng.nextInt(1, 6);
                    description += ` The city will disappear in ${days} day${
                        days !== 1 ? "s" : ""
                    }.`;
                } else {
                    description +=
                        " The city will remain visible indefinitely.";
                }
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `A city can be clearly seen atop a cloud`,
                    start: today,
                    end: today,
                    backgroundColor: "#800020",
                });
            } else if (special === 89) {
                let duration = rng.nextInt(1, 6);
                if (rng.nextInt(1, 6) === 1) {
                    duration *= 2;
                }
                const nRoll = rng.nextInt(1, 6);
                let n = 0;
                if (nRoll <= 3) {
                    n = 1;
                } else if (nRoll <= 5) {
                    n = 2;
                } else {
                    n = 3;
                }
                const portent = rng.nextBoolean();
                let description =
                    "The events portend nothing. Sometimes, weird stuff happens.";
                if (portent) {
                    const effect = rng.nextInt(1, 6);
                    if (effect <= 4) {
                        description =
                            "The events portend some terrible disaster.";
                    } else {
                        description =
                            "The events portend some propitious boon.";
                    }
                }
                const start = new Date(today);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Strange things occur that violate the laws of nature (${n} type${
                        n === 1 ? "" : "s"
                    } of occurrence)`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description: `Examples include birds flying backwards, rain falling *up*, water not boiling, domesticated animals birth unnatural monstrosities, animals speaking with human voices, etc. ${description}`,
                    },
                });
            } else if (special === 90) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description =
                            "There is a chance every five minutes while the rainbow is visible that a leprechaun approaches the party, offering the adventurers directions to its pot of gold in exchange for some fey bargain.";
                        break;
                    case 2:
                        description =
                            "The rainbow is a bridge to another world, and will transport any who step aboard to this other realm. There bridge may be guarded.";
                        break;
                    case 3:
                        description =
                            "The rainbow is an omen sent by the gods, to guide the adventurers to their destiny. This may be something they actually seek or a person, item, or place as yet unknown to them.";
                        break;
                    default:
                        description = "Sometimes a rainbow is just a rainbow.";
                        break;
                }
                if (rng.nextInt(1, 6) === 1) {
                    description += " The stripes are in an unusual order.";
                }
                const typeRoll = rng.nextInt(1, 6);
                let type = "";
                if (typeRoll <= 3) {
                    type = "single";
                } else if (typeRoll <= 5) {
                    type = "double";
                } else {
                    type = "triple";
                }
                const hour = rng.nextInt(9, 17);
                let minutes = rng.nextInt(1, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `A ${type} rainbow appears in a sky without rain`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 91) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                        description =
                            "It is a sentient creature, possibly an elemental.";
                        break;
                    case 2:
                        description = "It produces barely audible music.";
                        break;
                    case 3:
                        description =
                            "It acts as a gateway to other worlds. One must be able to fly into the shimmering lights in order to travel by these means.";
                        break;
                    case 4:
                        description =
                            "It causes all spells cast under its light to have all their variable effects occur at their maximum limits.";
                        break;
                    case 5:
                    case 6:
                        description = "It is just pretty lights in the sky.";
                        break;
                }
                const hour = (18 + rng.nextInt(0, 14)) % 24;
                let minutes = multiRoll(3, 20);
                if (rng.nextInt(1, 6) === 1) {
                    minutes *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + minutes * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `An aurora of light appears in the night sky, dancing as if alive`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 92) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                if (effect <= 4) {
                    description = "This is a simple natural phenomenon.";
                } else if (effect === 5) {
                    description =
                        "The lights are actually a sentient beings, attempting to communicate in a language based on the subtle flickering of light.";
                } else {
                    description =
                        "The lights increase the chance of encounters with undead whilst the fire lasts.";
                }
                description +=
                    ' "Corpse lights" are a harmless form of static lightning that typically appear during preciptation events and tend to coalesce on pointed objects, such as masts, prows, spires of towers, etc., although there are reports of people\'s fingers and noses being outlined in this strange, flickering light.';
                const hour = rng.nextInt(0, 23);
                let hours = rng.nextInt(1, 20);
                if (rng.nextInt(1, 6) === 1) {
                    hours *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `Corpse lights appear during preciptation events`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 93) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                    case 2:
                        description = "This is normal fog.";
                        break;
                    case 3:
                        description =
                            "The fog contains monsters not native to the region.";
                        break;
                    case 4:
                        description =
                            "The fog is semi-solid, reducing movement speed.";
                        break;
                    case 5:
                        description =
                            "The fog leads to another world or plane. Any persons becoming lost in the fog have a 1 in 6 chance of entering this other world for every hour spent wandering.";
                        break;
                    case 6:
                        description =
                            "The fog causes any humans or demi-humans that die within the fog to automatically rise as undead unless cremated within an hour of death.";
                        break;
                }
                const hour = rng.nextInt(0, 23);
                let hours = rng.nextInt(1, 20);
                if (rng.nextInt(1, 6) === 1) {
                    hours *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `A dense fog covers the land, greatly reducing visibility`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 94) {
                const effect = rng.nextInt(1, 6);
                let description = "";
                switch (effect) {
                    case 1:
                    case 2:
                    case 3:
                        description = "This is normal mist.";
                        break;
                    case 4:
                        description =
                            "The mist contains life-draining mist monsters.";
                        break;
                    case 5:
                        description = "The mist smells of sulphur.";
                        break;
                    case 6:
                        description = "Spells cast within the mist may fail.";
                        break;
                }
                const hour = rng.nextInt(0, 23);
                let hours = rng.nextInt(1, 12);
                if (rng.nextInt(1, 6) === 1) {
                    hours *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `A thin mist covers the land`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description,
                    },
                });
            } else if (special === 95) {
                ballLightning = rng.nextInt(1, 10);
            } else if (special === 98) {
                const drought = rng.nextBoolean();
                let affected = "";
                const roll = rng.nextInt(1, 8);
                if (roll <= 3) {
                    affected = " arcane";
                } else if (roll <= 6) {
                    affected = " divine";
                }
                const hour = rng.nextInt(0, 23);
                let hours = rng.nextInt(1, 24);
                if (rng.nextInt(1, 6) === 1) {
                    hours *= 2;
                }
                const start = new Date(today);
                start.setHours(hour);
                const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
                events.push({
                    id: nanoid(),
                    allDay: false,
                    title: `A ${
                        drought ? "drought" : "surfeit"
                    } of magical energy affects all${affected} spells`,
                    start,
                    end,
                    backgroundColor: "#800020",
                    extendedProps: {
                        description:
                            "A drought may mean making saving throws for spells to work at all. A surfeit may mean spells are cast with a higher effective level.",
                    },
                });
            } else {
                events.push({
                    id: nanoid(),
                    allDay: true,
                    title: `Undefined special event! Get creative!`,
                    start: today,
                    end: today,
                    backgroundColor: "#800020",
                });
            }
        }

        // Adjust clear/cloudy based on climate
        if (climate === "arid") {
            overall -= rng.nextInt(1, 4);
        } else if (climate === "tropical") {
            overall += rng.nextInt(1, 4);
        }

        // Check chance of rain
        let specific = rng.nextInt(1, 20);
        if (spec67Days > 0) {
            if (spec67 === "increase") {
                specific += rng.nextInt(1, 6);
            } else if (spec67 === "decrease") {
                specific -= rng.nextInt(1, 6);
            }
            spec67Days--;
        }
        let precip: PrecipType | undefined = undefined;
        // clear
        if (overall <= 10) {
            events.push({
                id: nanoid(),
                allDay: true,
                title: "clear",
                start: today,
                end: today,
                backgroundColor: "#87CEEB",
            });
            if (
                (climate === "arid" && specific > 19) ||
                (climate === "temperate" && specific > 16) ||
                (climate === "tropical" && specific > 13)
            ) {
                precip = calcRain();
                hailstorm = undefined;
                ballLightning = undefined;
            }
            // cloudy
        } else {
            events.push({
                id: nanoid(),
                allDay: true,
                title: "cloudy",
                start: today,
                end: today,
                backgroundColor: "#B6B6B4",
            });
            if (
                (climate === "arid" && specific > 15) ||
                (climate === "temperate" && specific > 10) ||
                (climate === "tropical" && specific > 7)
            ) {
                precip = calcRain();
                hailstorm = undefined;
                ballLightning = undefined;
            }
        }
        if (precip !== undefined) {
            const wHour = new Date(today);
            wHour.setHours(precip.start);
            let endTime: Date = wHour;
            if (precip.duration < 1) {
                const minutes = Math.round(precip.duration * 60);
                endTime = new Date(wHour.getTime() + minutes * 60 * 1000);
            } else {
                endTime = new Date(
                    wHour.getTime() + precip.duration * 60 * 60 * 1000,
                );
            }
            const rainEvent: CalendarEvent = {
                id: nanoid(),
                allDay: false,
                title: precip.nature,
                start: wHour,
                end: endTime,
            };

            if (magicalRain !== undefined) {
                rainEvent.title += ` MAGICAL`;
                rainEvent.extendedProps = {
                    description: magicalRain,
                };
                magicalRain = undefined;
            }

            if (precip.nature.includes(", violent")) {
                rainEvent.backgroundColor = "#003366";
            } else if (precip.nature.includes(", moderate")) {
                rainEvent.backgroundColor = "#4169e1";
            } else {
                rainEvent.backgroundColor = "#add8e6";
            }
            events.push(rainEvent);
        }
        if (spec70Days > 0) {
            spec70Days--;
        }
    }

    // consolidate events
    const cc: CalendarEvent[] = events.filter(
        (e) => e.title === "cloudy" || e.title === "clear",
    );
    const rest: CalendarEvent[] = events.filter(
        (e) => e.title !== "cloudy" && e.title !== "clear",
    );
    cc.sort((a, b) => a.start.valueOf() - b.start.valueOf());

    let last: CalendarEvent | undefined = undefined;
    const consolidated: CalendarEvent[] = [];
    for (let i = 0; i < cc.length; i++) {
        // only if just starting
        if (last === undefined) {
            last = cc[i];
            // if same event
        } else if (cc[i].title === last.title) {
            const ext = new Date(cc[i].end);
            ext.setDate(ext.getDate() + 1);
            last.end = ext;
            // otherwise different events
        } else {
            consolidated.push({ ...last });
            last = cc[i];
        }
    }
    if (last !== undefined) {
        consolidated.push({ ...last });
    }

    return [...consolidated, ...rest];
};
