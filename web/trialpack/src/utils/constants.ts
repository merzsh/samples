/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * This file is part of TrialPack.
 *
 * TrialPack is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const STR_ID_APP_EDITOR2D = 'editor2d';
export const STR_ID_APP_STOPLIGHT = 'stoplight';

export const STR_FILE_EXT_PNG = 'png';
export const STR_FILENAME_RESOURCES = 'resources';
export const STR_FILENAME_IMG = 'img';
export const STR_FILENAME_GO = 'go';
export const STR_FILENAME_UP = 'up';
export const STR_FILENAME_BACKGROUND = 'background';
export const STR_FILENAME_GO_PNG = `${STR_FILENAME_GO}.${STR_FILE_EXT_PNG}`;
export const STR_FILENAME_UP_PNG = `${STR_FILENAME_UP}.${STR_FILE_EXT_PNG}`;
export const STR_FILENAME_BACKGROUND_PNG = `${STR_FILENAME_BACKGROUND}.${STR_FILE_EXT_PNG}`;

export const STR_URL_EMPTY = '#';
export const STR_URL_ROOT = '/';

export const STR_ID = 'id';
export const STR_ID_HEADER = 'header';
export const STR_ID_APP_SELECTOR = 'AppSelector';
export const STR_ID_HEADER_APP_SELECTOR =
  `${STR_ID}${STR_ID_HEADER.substring(0, 1).toUpperCase() + STR_ID_HEADER.substring(1)}${STR_ID_APP_SELECTOR}`;

export const STR_CLASS_HEADER = STR_ID_HEADER;
export const STR_CLASS_HEADER__BACK = `${STR_ID_HEADER}__back`;
export const STR_CLASS_HEADER__BACK__LEFT = `${STR_CLASS_HEADER__BACK}__left`;
export const STR_CLASS_HEADER__BACK__LEFT__SELECTOR = `${STR_CLASS_HEADER__BACK__LEFT}__selector`;
export const STR_CLASS_HEADER__BACK__BETWEEN = `${STR_CLASS_HEADER__BACK}__between`;
export const STR_CLASS_HEADER__BACK__BETWEEN_TOP = `${STR_CLASS_HEADER__BACK__BETWEEN}__top`;
export const STR_CLASS_HEADER__BACK__BETWEEN_BOTTOM = `${STR_CLASS_HEADER__BACK__BETWEEN}__bottom`;
export const STR_CLASS_HEADER__BACK__RIGHT = `${STR_CLASS_HEADER__BACK}__right`;

export const STR_CLASS_MAIN = 'main';
export const STR_CLASS_MAIN_EDITOR_2D = `${STR_CLASS_MAIN}-editor2d`;
